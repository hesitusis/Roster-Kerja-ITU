import csv, json, urllib.request

url = "https://docs.google.com/spreadsheets/d/1wb2_93gm4DmLGcA4fZyWrK77zylG26iA4mp9xnt2Kx4/export?format=csv&gid=318146429"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    content = response.read().decode('utf-8')

reader = csv.reader(content.splitlines())
header = next(reader)
rows = list(reader)

date_cols = header[6:36] # 9/1/2026 to 9/30/2026

employees = []
roster = {}

for idx, r in enumerate(rows):
    if not r or not r[0].strip():
        continue
    nik = r[0].strip()
    name = r[1].strip()
    jabatan = r[2].strip()
    dept = r[3].strip()
    por = r[4].strip()
    kimper_raw = r[5].strip()
    kimpers = [k.strip().upper() for k in kimper_raw.split(",") if k.strip()]
    
    emp_id = f"emp-{nik}"
    role = "admin" if jabatan in ["PROJECT HEAD", "DEPUTY PROJECT HEAD"] else "staff"
    
    clean_name = name.lower().replace(" ", ".").replace("'", "")
    emp = {
        "id": emp_id,
        "name": name,
        "nip": nik,
        "department": dept,
        "position": jabatan,
        "por": por,
        "kimper": kimpers,
        "role": role,
        "email": f"{clean_name}@company.com",
        "phone": f"0812{idx+1000:04d}00",
        "joinDate": "2024-01-01",
        "isActive": True
    }
    employees.append(emp)
    
    emp_roster = {}
    for d_idx, d_str in enumerate(date_cols):
        parts = d_str.split("/")
        month = int(parts[0])
        day = int(parts[1])
        year = int(parts[2])
        iso_date = f"{year}-{month:02d}-{day:02d}"
        
        shift_val = r[6 + d_idx].strip().upper() if (6 + d_idx) < len(r) else ""
        if not shift_val:
            shift_val = "OFF"
        
        emp_roster[iso_date] = {
            "shift": shift_val
        }
    roster[emp_id] = emp_roster

print(f"Total employees parsed: {len(employees)}")
print(f"Sample 1: {employees[0]['name']} ({employees[0]['nip']}) - Dept: {employees[0]['department']} - POR: {employees[0]['por']}")
print(f"Sample shifts 9/1 - 9/7 for {employees[0]['name']}: {[roster[employees[0]['id']][f'2026-09-{d:02d}']['shift'] for d in range(1, 8)]}")
print(f"Sample 2: {employees[1]['name']} ({employees[1]['nip']}) - Dept: {employees[1]['department']} - POR: {employees[1]['por']}")
print(f"Sample shifts 9/1 - 9/7 for {employees[1]['name']}: {[roster[employees[1]['id']][f'2026-09-{d:02d}']['shift'] for d in range(1, 8)]}")

with open("scripts/parsed_employees.json", "w") as f:
    json.dump(employees, f, indent=2)

with open("scripts/parsed_roster.json", "w") as f:
    json.dump(roster, f, indent=2)
