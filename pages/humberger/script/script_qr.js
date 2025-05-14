document.addEventListener('DOMContentLoaded', async function () {
    const qrTableBody = document.getElementById('qrTableBody');

    try {
        // Ambil data siswa dari API
        const response = await fetch('https://faqih.pythonanywhere.com/api/siswa/qrcode', {
            credentials: 'include'  // Pastikan cookie dikirim
        });
        if (!response.ok) {
            throw new Error('Gagal mengambil data siswa');
        }

        const studentsData = await response.json();

        // Tampilkan data siswa dan QR Code di tabel
        if (qrTableBody && studentsData.length > 0) {
            studentsData.forEach((student, index) => {
                const row = qrTableBody.insertRow();
                const noCell = row.insertCell();
                const nameCell = row.insertCell();
                const qrCell = row.insertCell();
                const downloadCell = row.insertCell();

                // Nomor
                noCell.textContent = index + 1;

                // Nama Siswa
                nameCell.textContent = student.nama;

                // QR Code
                const qrImg = document.createElement('img');
                qrImg.src = `http://127.0.0.1:6000${student.qr_code_url}`;
                qrImg.alt = `QR Code ${student.nama}`;
                qrImg.width = 100;
                qrImg.height = 100;
                qrCell.appendChild(qrImg);

                // Tombol Download
                const downloadLink = document.createElement('a');
                downloadLink.textContent = 'Download';
                downloadLink.href = `http://127.0.0.1:6000${student.qr_code_url}`;
                downloadLink.download = `${student.nama}_QR.png`;
                downloadCell.appendChild(downloadLink);
            });
        } else {
            qrTableBody.innerHTML = '<tr><td colspan="4">Tidak ada data siswa</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        qrTableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data siswa</td></tr>';
    }

    document.getElementById('hamburger').addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        // Toggle class 'hidden' pada sidebar
        sidebar.classList.toggle('hidden');

        // Toggle class 'collapsed' pada konten utama
        mainContent.classList.toggle('collapsed');
    });
});
