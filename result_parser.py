import os
import re
import json
from PyPDF2 import PdfReader
from datetime import datetime
from tqdm import tqdm

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file."""
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text


def parse_student_data(text):
    """
    Parses student data using same logic as React component.
    Example input inside PDF:
    721434 { gpa1: 3.40, gpa2: 3.10, gpa3: 2.80, gpa4: ref, ref_sub: 25841, 28553 }
    or 721437 { 25841(T), 28553(T) }
    """

    student_regex = re.compile(r"\d{6}\s*(?:\(([\s\S]*?)\)|\{([\s\S]*?)\})", re.MULTILINE)
    matches = student_regex.findall(text)
    results = []

    for match in matches:
        content = match[0] or match[1]
        roll_match = re.search(r"(\d{6})", content)
        roll = roll_match.group(1) if roll_match else "Unknown"

        # Check if GPA exists
        if not re.search(r"gpa", content, re.IGNORECASE):
            failed_subs = [s.strip() for s in re.split(r"[,\s]+", content) if s.strip()]
            results.append({
                "Roll": roll,
                **{f"GPA{i}": "-" for i in range(1, 9)},
                "Status": "Drop",
                "Failed Subs": ", ".join(failed_subs) or "-"
            })
            continue

        gpas = {}
        failed_gpa = []

        # Extract GPAs
        for g in re.finditer(r"gpa(\d+):\s*([\d.]+|ref)", content, re.IGNORECASE):
            num, val = g.groups()
            gpas[f"GPA{num}"] = val
            if val.lower() == "ref":
                failed_gpa.append(f"GPA{num}")

        # Fill missing GPAs up to 8
        for i in range(1, 9):
            gpas.setdefault(f"GPA{i}", "-")

        # Extract failed subjects
        ref_match = re.search(r"ref_sub:\s*([^}]*)", content, re.IGNORECASE)
        failed_subs = ref_match.group(1).strip() if ref_match else (", ".join(failed_gpa) if failed_gpa else "-")

        status = "Failed" if failed_gpa else "Passed"

        results.append({
            "Roll": roll,
            **gpas,
            "Status": status,
            "Failed Subs": failed_subs
        })

    return results


def process_pdfs(input_folder):
    """Process all PDF files in a folder."""
    all_results = []
    pdf_files = [f for f in os.listdir(input_folder) if f.endswith(".pdf")]

    if not pdf_files:
        print("⚠️ No PDF files found in folder!")
        return []

    for pdf in tqdm(pdf_files, desc="Processing PDFs", ncols=100):
        pdf_path = os.path.join(input_folder, pdf)
        text = extract_text_from_pdf(pdf_path)
        data = parse_student_data(text)
        all_results.extend(data)

    return all_results


def export_to_json(data, output_folder="."):
    """Save parsed data to a JSON file."""
    os.makedirs(output_folder, exist_ok=True)
    filename = f"rpicc-results-{datetime.now().strftime('%Y%m%d')}.json"
    path = os.path.join(output_folder, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Results exported to: {path}")


if __name__ == "__main__":
    print("📁 GPA Result Parser (Python Edition)")
    folder = input("Enter the folder path containing PDFs: ").strip()

    if not os.path.isdir(folder):
        print("❌ Invalid folder path.")
        exit()

    results = process_pdfs(folder)

    if results:
        export_to_json(results)
        print(f"🎉 {len(results)} records processed successfully!")
    else:
        print("⚠️ No data extracted from PDFs.")
