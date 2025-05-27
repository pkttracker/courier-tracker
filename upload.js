document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('excelFile');
    const uploadStatusDiv = document.getElementById('uploadStatus');
    const file = fileInput.files[0];

    if (!file) {
        uploadStatusDiv.innerHTML = '<p class="error-message">Please select an Excel file to upload.</p>';
        return;
    }

    // IMPORTANT: This URL needs to be 'http://localhost:5000' for local testing
    const backendBaseUrl = 'http://localhost:5000';

    const formData = new FormData();
    formData.append('file', file); // 'file' matches the 'file' in request.files in Flask

    uploadStatusDiv.innerHTML = '<p class="info-message">Uploading file, please wait...</p>';

    try {
        const response = await fetch(`${backendBaseUrl}/upload-excel`, {
            method: 'POST',
            body: formData, // FormData handles setting Content-Type header automatically
        });
        const data = await response.json();

        if (response.ok) {
            let message = `<p class="info-message">Successfully processed data from "${file.name}".</p>`;
            message += `<p class="info-message">Inserted: ${data.inserted_records} new records.</p>`;
            message += `<p class="info-message">Updated: ${data.updated_records} existing records.</p>`;

            if (data.errors_in_rows && data.errors_in_rows.length > 0) {
                message += '<p class="error-message">Errors occurred in some rows:</p><ul>';
                data.errors_in_rows.forEach(err => {
                    message += `<li>${err}</li>`;
                });
                message += '</ul>';
            }
            uploadStatusDiv.innerHTML = message;
        } else {
            uploadStatusDiv.innerHTML = `<p class="error-message">Upload failed: ${data.error || 'Unknown error'}</p>`;
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        uploadStatusDiv.innerHTML = '<p class="error-message">Failed to connect to the backend for upload. Is the backend server running?</p>';
    }
});
