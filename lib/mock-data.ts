import { Employee, LeaveRequest, RosterData, ShiftCode } from './types';

// 47 Data Karyawan Resmi disinkronkan langsung dari Google Spreadsheet ROSTER KERJA
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    "id": "emp-8583",
    "name": "ADITYA SAPARINGGA",
    "nip": "8583",
    "department": "SERVICE",
    "position": "FOREMAN",
    "por": "SURABAYA",
    "kimper": [
      "LV",
      "FORKLIFT"
    ],
    "role": "staff",
    "email": "aditya.saparingga@company.com",
    "phone": "0812100000",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8583"
  },
  {
    "id": "emp-8539",
    "name": "NOR RAKHMAN",
    "nip": "8539",
    "department": "SERVICE",
    "position": "MEKANIK M3",
    "por": "TABALONG",
    "kimper": [
      "LV",
      "FORKLIFT",
      "WAH"
    ],
    "role": "staff",
    "email": "nor.rakhman@company.com",
    "phone": "0812100100",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8539"
  },
  {
    "id": "emp-8383",
    "name": "SAPTA MILAYANTO",
    "nip": "8383",
    "department": "SERVICE",
    "position": "MEKANIK M2",
    "por": "TABALONG",
    "kimper": [
      "LV"
    ],
    "role": "staff",
    "email": "sapta.milayanto@company.com",
    "phone": "0812100200",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8383"
  },
  {
    "id": "emp-9087",
    "name": "MUHAMMAD SYARIF",
    "nip": "9087",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "TABALONG",
    "kimper": [
      "LV"
    ],
    "role": "staff",
    "email": "muhammad.syarif@company.com",
    "phone": "0812100300",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9087"
  },
  {
    "id": "emp-9010",
    "name": "MUHAMMAD RIZAL",
    "nip": "9010",
    "department": "SERVICE",
    "position": "MEKANIK M3",
    "por": "BANJARMASIN",
    "kimper": [
      "LV",
      "WAH"
    ],
    "role": "staff",
    "email": "muhammad.rizal@company.com",
    "phone": "0812100400",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9010"
  },
  {
    "id": "emp-9071",
    "name": "MUHAMMAD RIFA'I",
    "nip": "9071",
    "department": "SERVICE",
    "position": "MEKANIK M2",
    "por": "SURABAYA",
    "kimper": [
      "LV",
      "OHC",
      "WAH"
    ],
    "role": "staff",
    "email": "muhammad.rifai@company.com",
    "phone": "0812100500",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9071"
  },
  {
    "id": "emp-9038",
    "name": "VENDY PURNOMO",
    "nip": "9038",
    "department": "SERVICE",
    "position": "MEKANIK M2",
    "por": "SEMARANG",
    "kimper": [
      "LV",
      "WAH"
    ],
    "role": "staff",
    "email": "vendy.purnomo@company.com",
    "phone": "0812100600",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9038"
  },
  {
    "id": "emp-8381",
    "name": "JIM NAPOLEON",
    "nip": "8381",
    "department": "SERVICE",
    "position": "MEKANIK M2",
    "por": "TABALONG",
    "kimper": [
      "OHC",
      "WAH"
    ],
    "role": "staff",
    "email": "jim.napoleon@company.com",
    "phone": "0812100700",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8381"
  },
  {
    "id": "emp-8344",
    "name": "BAJA BARA",
    "nip": "8344",
    "department": "SERVICE",
    "position": "MEKANIK M3",
    "por": "TABALONG",
    "kimper": [
      "WAH",
      "RIGGER"
    ],
    "role": "staff",
    "email": "baja.bara@company.com",
    "phone": "0812100800",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8344"
  },
  {
    "id": "emp-8427",
    "name": "AHMAD IFRIYANDI",
    "nip": "8427",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "TABALONG",
    "kimper": [
      "RIGGER"
    ],
    "role": "staff",
    "email": "ahmad.ifriyandi@company.com",
    "phone": "0812100900",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8427"
  },
  {
    "id": "emp-8347",
    "name": "SUSANTO",
    "nip": "8347",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "susanto@company.com",
    "phone": "0812101000",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8347"
  },
  {
    "id": "emp-9463",
    "name": "ANWAR RIZANIE",
    "nip": "9463",
    "department": "SERVICE",
    "position": "FOREMAN",
    "por": "SAMARINDA",
    "kimper": [],
    "role": "staff",
    "email": "anwar.rizanie@company.com",
    "phone": "0812101100",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9463"
  },
  {
    "id": "emp-45261",
    "name": "MUHAMMAD SALAHUDDIN AL AMIN",
    "nip": "45261",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "BANJARMASIN",
    "kimper": [
      "FORKLIFT"
    ],
    "role": "staff",
    "email": "muhammad.salahuddin.al.amin@company.com",
    "phone": "0812101200",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "45261"
  },
  {
    "id": "emp-1779",
    "name": "IRAWAN MAULANA",
    "nip": "1779",
    "department": "SERVICE",
    "position": "JUNIOR MEKANIK",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "irawan.maulana@company.com",
    "phone": "0812101300",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1779"
  },
  {
    "id": "emp-9744",
    "name": "M. SYARIF AKBAR",
    "nip": "9744",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "BANJARMASIN",
    "kimper": [],
    "role": "staff",
    "email": "m..syarif.akbar@company.com",
    "phone": "0812101400",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9744"
  },
  {
    "id": "emp-9741",
    "name": "EKA DARMA WIJAYA",
    "nip": "9741",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "eka.darma.wijaya@company.com",
    "phone": "0812101500",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9741"
  },
  {
    "id": "emp-10298",
    "name": "EDDY SANTOSO",
    "nip": "10298",
    "department": "SERVICE",
    "position": "MEKANIK M1",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "eddy.santoso@company.com",
    "phone": "0812101600",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "10298"
  },
  {
    "id": "emp-1591",
    "name": "WAHYUDIN NOR",
    "nip": "1591",
    "department": "SERVICE",
    "position": "JUNIOR MEKANIK",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "wahyudin.nor@company.com",
    "phone": "0812101700",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1591"
  },
  {
    "id": "emp-9216",
    "name": "TRIYONO",
    "nip": "9216",
    "department": "SERVICE",
    "position": "MEKANIK M3",
    "por": "SEMARANG",
    "kimper": [
      "OHC"
    ],
    "role": "staff",
    "email": "triyono@company.com",
    "phone": "0812101800",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9216"
  },
  {
    "id": "emp-9212",
    "name": "HENDRA SETIAWAN",
    "nip": "9212",
    "department": "SERVICE",
    "position": "MEKANIK M2",
    "por": "SEMARANG",
    "kimper": [],
    "role": "staff",
    "email": "hendra.setiawan@company.com",
    "phone": "0812101900",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9212"
  },
  {
    "id": "emp-1825",
    "name": "FINO SANDI SAPUTRA",
    "nip": "1825",
    "department": "SERVICE",
    "position": "JUNIOR MEKANIK",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "fino.sandi.saputra@company.com",
    "phone": "0812102000",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1825"
  },
  {
    "id": "emp-1826",
    "name": "SYAHRIL HIDAYAT",
    "nip": "1826",
    "department": "SERVICE",
    "position": "JUNIOR MEKANIK",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "syahril.hidayat@company.com",
    "phone": "0812102100",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1826"
  },
  {
    "id": "emp-9944",
    "name": "RIKY AL TARIK SYAH PUTRA",
    "nip": "9944",
    "department": "SERVICE",
    "position": "MEKANIK M3",
    "por": "SEMARANG",
    "kimper": [
      "LV",
      "FORKLIFT"
    ],
    "role": "staff",
    "email": "riky.al.tarik.syah.putra@company.com",
    "phone": "0812102200",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9944"
  },
  {
    "id": "emp-9065",
    "name": "AWANG YULI SETYADI",
    "nip": "9065",
    "department": "SERVICE",
    "position": "SERVICE SUPERVISOR",
    "por": "SEMARANG",
    "kimper": [
      "FORKLIFT"
    ],
    "role": "admin_service",
    "email": "awang.yuli.setyadi@company.com",
    "phone": "0812102300",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9065"
  },
  {
    "id": "emp-9821",
    "name": "YUDA PRATAMA RIANTO",
    "nip": "9821",
    "department": "SERVICE",
    "position": "DEPUTY PROJECT HEAD",
    "por": "BALIKPAPAN",
    "kimper": [],
    "role": "admin_service,hse,HRGA FA, Part",
    "email": "yuda.pratama.rianto@company.com",
    "phone": "0812102400",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9821"
  },
  {
    "id": "emp-8339",
    "name": "SARI NASIB P. SIBUEA",
    "nip": "8339",
    "department": "SERVICE",
    "position": "PPIC",
    "por": "JAKARTA",
    "kimper": [],
    "role": "admin_part",
    "email": "sari.nasib.p..sibuea@company.com",
    "phone": "0812102500",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8339"
  },
  {
    "id": "emp-1849",
    "name": "SUBHANNOR",
    "nip": "1849",
    "department": "SERVICE",
    "position": "ADMIN GENERAL",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "subhannor@company.com",
    "phone": "0812102600",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1849"
  },
  {
    "id": "emp-9108",
    "name": "MUHAMMAD ALI",
    "nip": "9108",
    "department": "HSE",
    "position": "HSE OFFICER",
    "por": "TABALONG",
    "kimper": [],
    "role": "admin_hse",
    "email": "muhammad.ali@company.com",
    "phone": "0812102700",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9108"
  },
  {
    "id": "emp-8414",
    "name": "MULYANTO",
    "nip": "8414",
    "department": "SERVICE",
    "position": "PROJECT HEAD",
    "por": "SEMARANG",
    "kimper": [],
    "role": "admin_service,hse,HRGA FA, Part",
    "email": "mulyanto@company.com",
    "phone": "0812102800",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8414"
  },
  {
    "id": "emp-9165",
    "name": "DEWI APRILIANI",
    "nip": "9165",
    "department": "HRGA FA",
    "position": "GENERAL AFFAIRS",
    "por": "TABALONG",
    "kimper": [],
    "role": "admin_hrga_fa",
    "email": "dewi.apriliani@company.com",
    "phone": "0812102900",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9165"
  },
  {
    "id": "emp-9884",
    "name": "YUSUF SHOLIKHIN",
    "nip": "9884",
    "department": "HRGA FA",
    "position": "FINANCE & ACCOUNTING",
    "por": "BANJARMASIN",
    "kimper": [],
    "role": "staff",
    "email": "yusuf.sholikhin@company.com",
    "phone": "0812103000",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9884"
  },
  {
    "id": "emp-9266",
    "name": "HARIYADI",
    "nip": "9266",
    "department": "HRGA FA",
    "position": "HRGA FA SUPERVISOR",
    "por": "TABALONG",
    "kimper": [],
    "role": "admin_hrga_fa",
    "email": "hariyadi@company.com",
    "phone": "0812103100",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9266"
  },
  {
    "id": "emp-1772",
    "name": "JAMALUDIN",
    "nip": "1772",
    "department": "HRGA FA",
    "position": "DRIVER DAN OPERATOR FORKLIFT",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "jamaludin@company.com",
    "phone": "0812103200",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1772"
  },
  {
    "id": "emp-1800",
    "name": "KAHPI ANSYARI",
    "nip": "1800",
    "department": "HRGA FA",
    "position": "DRIVER",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "kahpi.ansyari@company.com",
    "phone": "0812103300",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1800"
  },
  {
    "id": "emp-8332",
    "name": "PRIANGGONO",
    "nip": "8332",
    "department": "PART",
    "position": "PARTS ANALYST",
    "por": "BALIKPAPAN",
    "kimper": [],
    "role": "admin_part",
    "email": "prianggono@company.com",
    "phone": "0812103400",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8332"
  },
  {
    "id": "emp-1793",
    "name": "NUR FALAH RAMADHANTY",
    "nip": "1793",
    "department": "PART",
    "position": "ADMIN PART",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "nur.falah.ramadhanty@company.com",
    "phone": "0812103500",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1793"
  },
  {
    "id": "emp-1808",
    "name": "AKHMAD SULAIMAN",
    "nip": "1808",
    "department": "PART",
    "position": "ADMIN PART",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "akhmad.sulaiman@company.com",
    "phone": "0812103600",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1808"
  },
  {
    "id": "emp-1615",
    "name": "AGUS SALIM",
    "nip": "1615",
    "department": "PART",
    "position": "STOREMAN",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "agus.salim@company.com",
    "phone": "0812103700",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1615"
  },
  {
    "id": "emp-1594",
    "name": "AHMAT SAYUTI",
    "nip": "1594",
    "department": "PART",
    "position": "STOREMAN",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "ahmat.sayuti@company.com",
    "phone": "0812103800",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1594"
  },
  {
    "id": "emp-1797",
    "name": "BARA TEGUH PRIBADI",
    "nip": "1797",
    "department": "PART",
    "position": "STOREMAN",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "bara.teguh.pribadi@company.com",
    "phone": "0812103900",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "1797"
  },
  {
    "id": "emp-9937",
    "name": "RAHMAT HIDAYAT",
    "nip": "9937",
    "department": "HSE",
    "position": "HSE OFFICER",
    "por": "BANJARMASIN",
    "kimper": [],
    "role": "admin_hse",
    "email": "rahmat.hidayat@company.com",
    "phone": "0812104000",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9937"
  },
  {
    "id": "emp-9938",
    "name": "MUHAMMAD RIFKI HIDAYAT",
    "nip": "9938",
    "department": "HSE",
    "position": "HSE OFFICER",
    "por": "BALIKPAPAN",
    "kimper": [],
    "role": "admin_hse",
    "email": "muhammad.rifki.hidayat@company.com",
    "phone": "0812104100",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "9938"
  },
  {
    "id": "emp-10200",
    "name": "TONY WIDAGDO",
    "nip": "10200",
    "department": "SERVICE",
    "position": "SERVICE SUPERVISOR",
    "por": "SEMARANG",
    "kimper": [],
    "role": "admin_service",
    "email": "tony.widagdo@company.com",
    "phone": "0812104200",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "10200"
  },
  {
    "id": "emp-2098",
    "name": "ILHAM WAHYUDI",
    "nip": "2098",
    "department": "SERVICE",
    "position": "ADMIN SERVICE",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "ilham.wahyudi@company.com",
    "phone": "0812104300",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "2098"
  },
  {
    "id": "emp-2103",
    "name": "FATHURAHMAN",
    "nip": "2103",
    "department": "SERVICE",
    "position": "ADMIN SERVICE",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "fathurahman@company.com",
    "phone": "0812104400",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "2103"
  },
  {
    "id": "emp-8310",
    "name": "M. ARBAIN",
    "nip": "8310",
    "department": "SERVICE",
    "position": "MEKANIK M2",
    "por": "BANJARMASIN",
    "kimper": [],
    "role": "staff",
    "email": "m..arbain@company.com",
    "phone": "0812104500",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "8310"
  },
  {
    "id": "emp-2108",
    "name": "DARIS DEWANTO",
    "nip": "2108",
    "department": "SERVICE",
    "position": "JUNIOR MEKANIK",
    "por": "TABALONG",
    "kimper": [],
    "role": "staff",
    "email": "daris.dewanto@company.com",
    "phone": "0812104600",
    "joinDate": "2024-01-01",
    "isActive": true,
    "username": "2108"
  }
];

// Jadwal Shift Riil September 2026 disinkronkan langsung dari Google Spreadsheet tab Roster_Bulanan
export const INITIAL_SEPTEMBER_2026_ROSTER: RosterData = {
  "emp-8583": {
    "2026-09-01": {
      "shift": "CT"
    },
    "2026-09-02": {
      "shift": "CT"
    },
    "2026-09-03": {
      "shift": "CT"
    },
    "2026-09-04": {
      "shift": "CT"
    },
    "2026-09-05": {
      "shift": "CT"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "P"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "OFF"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8539": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "OFF"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "OFF"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8383": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "OFF"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "OFF"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9087": {
    "2026-09-01": {
      "shift": "CT"
    },
    "2026-09-02": {
      "shift": "CT"
    },
    "2026-09-03": {
      "shift": "CT"
    },
    "2026-09-04": {
      "shift": "CT"
    },
    "2026-09-05": {
      "shift": "CT"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "OFF"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9010": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9071": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "CT"
    },
    "2026-09-05": {
      "shift": "CT"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "P"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9038": {
    "2026-09-01": {
      "shift": "CT"
    },
    "2026-09-02": {
      "shift": "CT"
    },
    "2026-09-03": {
      "shift": "CT"
    },
    "2026-09-04": {
      "shift": "P"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "OFF"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "OFF"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8381": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "OFF"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8344": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "OFF"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "OFF"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-8427": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "OFF"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "OFF"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-8347": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "OFF"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "OFF"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-9463": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "OFF"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-45261": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "OFF"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "OFF"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "OFF"
    }
  },
  "emp-1779": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "OFF"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9744": {
    "2026-09-01": {
      "shift": "C"
    },
    "2026-09-02": {
      "shift": "C"
    },
    "2026-09-03": {
      "shift": "C"
    },
    "2026-09-04": {
      "shift": "C"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "OFF"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "OFF"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9741": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "OFF"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "OFF"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-10298": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "OFF"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "OFF"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1591": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "OFF"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "OFF"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-9216": {
    "2026-09-01": {
      "shift": "P"
    },
    "2026-09-02": {
      "shift": "CT"
    },
    "2026-09-03": {
      "shift": "CT"
    },
    "2026-09-04": {
      "shift": "CT"
    },
    "2026-09-05": {
      "shift": "CT"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "C"
    },
    "2026-09-17": {
      "shift": "C"
    },
    "2026-09-18": {
      "shift": "C"
    },
    "2026-09-19": {
      "shift": "C"
    },
    "2026-09-20": {
      "shift": "C"
    },
    "2026-09-21": {
      "shift": "P"
    },
    "2026-09-22": {
      "shift": "OFF"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9212": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "OFF"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "P"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "P"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1825": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "OFF"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "OFF"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1826": {
    "2026-09-01": {
      "shift": "OFF"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "OFF"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "OFF"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-9944": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-9065": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "OFF"
    },
    "2026-09-05": {
      "shift": "P"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "C"
    },
    "2026-09-23": {
      "shift": "C"
    },
    "2026-09-24": {
      "shift": "C"
    },
    "2026-09-25": {
      "shift": "C"
    },
    "2026-09-26": {
      "shift": "P"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9821": {
    "2026-09-01": {
      "shift": "OFF"
    },
    "2026-09-02": {
      "shift": "OFF"
    },
    "2026-09-03": {
      "shift": "CT"
    },
    "2026-09-04": {
      "shift": "CT"
    },
    "2026-09-05": {
      "shift": "CT"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "C"
    },
    "2026-09-19": {
      "shift": "C"
    },
    "2026-09-20": {
      "shift": "P"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8339": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "CT"
    },
    "2026-09-03": {
      "shift": "CT"
    },
    "2026-09-04": {
      "shift": "CT"
    },
    "2026-09-05": {
      "shift": "CT"
    },
    "2026-09-06": {
      "shift": "CT"
    },
    "2026-09-07": {
      "shift": "CT"
    },
    "2026-09-08": {
      "shift": "CT"
    },
    "2026-09-09": {
      "shift": "CT"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "OFF"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1849": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "OFF"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "OFF"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9108": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "OFF"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "OFF"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8414": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9165": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "OFF"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-9884": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9266": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1772": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1800": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "CT"
    },
    "2026-09-11": {
      "shift": "CT"
    },
    "2026-09-12": {
      "shift": "CT"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "OFF"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8332": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "CT"
    },
    "2026-09-14": {
      "shift": "CT"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "P"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1793": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "OFF"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "OFF"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-1808": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "OFF"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "OFF"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1615": {
    "2026-09-01": {
      "shift": "N"
    },
    "2026-09-02": {
      "shift": "N"
    },
    "2026-09-03": {
      "shift": "N"
    },
    "2026-09-04": {
      "shift": "N"
    },
    "2026-09-05": {
      "shift": "OFF"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "N"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "OFF"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "N"
    },
    "2026-09-26": {
      "shift": "N"
    },
    "2026-09-27": {
      "shift": "N"
    },
    "2026-09-28": {
      "shift": "N"
    },
    "2026-09-29": {
      "shift": "N"
    },
    "2026-09-30": {
      "shift": "N"
    }
  },
  "emp-1594": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "N"
    },
    "2026-09-11": {
      "shift": "N"
    },
    "2026-09-12": {
      "shift": "N"
    },
    "2026-09-13": {
      "shift": "N"
    },
    "2026-09-14": {
      "shift": "OFF"
    },
    "2026-09-15": {
      "shift": "CT"
    },
    "2026-09-16": {
      "shift": "CT"
    },
    "2026-09-17": {
      "shift": "CT"
    },
    "2026-09-18": {
      "shift": "CT"
    },
    "2026-09-19": {
      "shift": "CT"
    },
    "2026-09-20": {
      "shift": "CT"
    },
    "2026-09-21": {
      "shift": "CT"
    },
    "2026-09-22": {
      "shift": "CT"
    },
    "2026-09-23": {
      "shift": "CT"
    },
    "2026-09-24": {
      "shift": "CT"
    },
    "2026-09-25": {
      "shift": "CT"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-1797": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "N"
    },
    "2026-09-07": {
      "shift": "N"
    },
    "2026-09-08": {
      "shift": "N"
    },
    "2026-09-09": {
      "shift": "N"
    },
    "2026-09-10": {
      "shift": "OFF"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "N"
    },
    "2026-09-22": {
      "shift": "N"
    },
    "2026-09-23": {
      "shift": "N"
    },
    "2026-09-24": {
      "shift": "N"
    },
    "2026-09-25": {
      "shift": "OFF"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9937": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "OFF"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "OFF"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-9938": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "OFF"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "OFF"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "CT"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-10200": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-2098": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "CT"
    },
    "2026-09-28": {
      "shift": "CT"
    },
    "2026-09-29": {
      "shift": "CT"
    },
    "2026-09-30": {
      "shift": "CT"
    }
  },
  "emp-2103": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "OFF"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "D"
    },
    "2026-09-18": {
      "shift": "D"
    },
    "2026-09-19": {
      "shift": "D"
    },
    "2026-09-20": {
      "shift": "D"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "OFF"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-8310": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "D"
    },
    "2026-09-06": {
      "shift": "D"
    },
    "2026-09-07": {
      "shift": "OFF"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "N"
    },
    "2026-09-16": {
      "shift": "N"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "N"
    },
    "2026-09-21": {
      "shift": "OFF"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  },
  "emp-2108": {
    "2026-09-01": {
      "shift": "D"
    },
    "2026-09-02": {
      "shift": "D"
    },
    "2026-09-03": {
      "shift": "D"
    },
    "2026-09-04": {
      "shift": "D"
    },
    "2026-09-05": {
      "shift": "N"
    },
    "2026-09-06": {
      "shift": "OFF"
    },
    "2026-09-07": {
      "shift": "D"
    },
    "2026-09-08": {
      "shift": "D"
    },
    "2026-09-09": {
      "shift": "D"
    },
    "2026-09-10": {
      "shift": "D"
    },
    "2026-09-11": {
      "shift": "D"
    },
    "2026-09-12": {
      "shift": "D"
    },
    "2026-09-13": {
      "shift": "D"
    },
    "2026-09-14": {
      "shift": "D"
    },
    "2026-09-15": {
      "shift": "D"
    },
    "2026-09-16": {
      "shift": "D"
    },
    "2026-09-17": {
      "shift": "N"
    },
    "2026-09-18": {
      "shift": "N"
    },
    "2026-09-19": {
      "shift": "N"
    },
    "2026-09-20": {
      "shift": "OFF"
    },
    "2026-09-21": {
      "shift": "D"
    },
    "2026-09-22": {
      "shift": "D"
    },
    "2026-09-23": {
      "shift": "D"
    },
    "2026-09-24": {
      "shift": "D"
    },
    "2026-09-25": {
      "shift": "D"
    },
    "2026-09-26": {
      "shift": "D"
    },
    "2026-09-27": {
      "shift": "D"
    },
    "2026-09-28": {
      "shift": "D"
    },
    "2026-09-29": {
      "shift": "D"
    },
    "2026-09-30": {
      "shift": "D"
    }
  }
};

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-8583',
    employeeName: 'ADITYA SAPARINGGA',
    department: 'SERVICE',
    type: 'CT',
    startDate: '2026-09-01',
    endDate: '2026-09-13',
    durationDays: 13,
    reason: 'Cuti Roster Periodik Surabaya',
    status: 'APPROVED',
    submittedAt: '2026-08-25T08:00:00Z',
    reviewedAt: '2026-08-26T10:00:00Z',
    reviewedBy: 'MULYANTO',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-9087',
    employeeName: 'MUHAMMAD SYARIF',
    department: 'SERVICE',
    type: 'CT',
    startDate: '2026-09-01',
    endDate: '2026-09-12',
    durationDays: 12,
    reason: 'Cuti Roster Periodik',
    status: 'APPROVED',
    submittedAt: '2026-08-24T09:00:00Z',
    reviewedAt: '2026-08-25T11:00:00Z',
    reviewedBy: 'MULYANTO',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-9216',
    employeeName: 'TRIYONO',
    department: 'SERVICE',
    type: 'CT',
    startDate: '2026-09-02',
    endDate: '2026-09-16',
    durationDays: 15,
    reason: 'Cuti Roster Semarang',
    status: 'APPROVED',
    submittedAt: '2026-08-28T08:00:00Z',
    reviewedAt: '2026-08-29T09:30:00Z',
    reviewedBy: 'MULYANTO',
  }
];

export function generateInitialRoster(year: number, monthIndex: number): RosterData {
  if (year === 2026 && monthIndex === 8) {
    const r = JSON.parse(JSON.stringify(INITIAL_SEPTEMBER_2026_ROSTER));
    if (r["emp-1"] && r["emp-1"]["2026-09-14"]) {
      r["emp-1"]["2026-09-14"] = {
        shift: 'D',
        previousShift: 'CT',
        updatedBy: 'Muhammad Rifki',
        updatedByUsername: 'mrifki',
        updatedAt: '12 Sep 2026 08:24',
        reason: 'Penyesuaian kebutuhan operasional',
        source: 'Web (Desktop) - 192.168.1.10',
      };
    }
    return r;
  }
  // Untuk bulan Oktober 2026 dan bulan lainnya yang belum dijadwalkan di spreadsheet,
  // roster default adalah KOSONG (belum diinput/dijadwalkan).
  const roster: RosterData = {};
  INITIAL_EMPLOYEES.forEach((emp) => {
    roster[emp.id] = {};
  });
  return roster;
}
