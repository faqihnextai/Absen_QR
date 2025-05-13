document.addEventListener('DOMContentLoaded', async function () {
    const sudahScanTable = document.getElementById('sudahScanTable').querySelector('tbody');
    const belumScanTable = document.getElementById('belumScanTable').querySelector('tbody');
    const submitButton = document.getElementById('submitAbsensiOrtu');

    // Ambil data siswa yang sudah scan
   async function fetchSudahScan() {
    try {
        const response = await fetch('http://127.0.0.1:6000/api/absensi-sudah-scan', {
            method: 'GET',
            credentials: 'include' // Pastikan cookie dikirim
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data siswa yang sudah scan:", data);

        sudahScanTable.innerHTML = '';
        data.forEach((siswa, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${siswa.nama}</td>
                <td>${siswa.status}</td>
                <td>${siswa.waktu}</td>
            `;
            sudahScanTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


    // Ambil data siswa yang belum scan
    async function fetchBelumScan() {
        try {
            const response = await fetch('http://127.0.0.1:6000/api/absensi-belum-scan', {
                method: 'GET',
                credentials: 'include' // Pastikan cookie dikirim
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data siswa yang belum scan:", data);

            belumScanTable.innerHTML = '';
            data.forEach((siswa, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${siswa.nama}</td>
                    <td>
                        <select class="statusSelect">
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                        </select>
                    </td>
                `;
                belumScanTable.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Submit data siswa yang belum scan ke absensi_harian_ortu
    submitButton.addEventListener('click', async function () {
        const rows = belumScanTable.querySelectorAll('tr');
        const dataToSubmit = Array.from(rows).map(row => {
            const today = new Date().toISOString().split('T')[0];
            const nama = row.cells[1].textContent;
            const status = row.querySelector('.statusSelect').value;
            return { nama, status, tanggal: today };
        });

        const response = await fetch('http://127.0.0.1:6000/api/submit-absensi-ortu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',  // Pastikan cookie dikirim
            body: JSON.stringify(dataToSubmit)
        });

        if (response.ok) {
            alert('Data berhasil disimpan ke absensi_harian_ortu!');
        } else {
            alert('Gagal menyimpan data!');
        }
    });

    // Panggil fungsi untuk mengambil data
    fetchSudahScan();
    fetchBelumScan();
});
