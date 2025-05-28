document.getElementById('trackButton').addEventListener('click', async () => {
    const consignmentNumberInput = document.getElementById('consignmentNumber');
    const trackingResultsDiv = document.getElementById('trackingResult');

    const rawInput = consignmentNumberInput.value.trim();
    if (!rawInput) {
        trackingResultsDiv.innerHTML = '<p class="error-message">Please enter one or more consignment numbers.</p>';
        return;
    }

    // Split the input by comma, remove extra spaces, and filter out empty strings
    const consignmentNumbers = rawInput.split(',').map(cn => cn.trim()).filter(cn => cn !== '');

    if (consignmentNumbers.length === 0) {
        trackingResultsDiv.innerHTML = '<p class="error-message">Please enter valid comma-separated consignment numbers.</p>';
        return;
    }

    // Limit to a maximum of 5 consignment numbers
    const maxConsignments = 5;
    if (consignmentNumbers.length > maxConsignments) {
        trackingResultsDiv.innerHTML = `<p class="error-message">Please enter a maximum of ${maxConsignments} consignment numbers at once.</p>`;
        return;
    }

    const backendBaseUrl = 'https://8c92-103-225-176-192.ngrok-free.app'; // <<-- Confirm this is correct for your setup
    trackingResultsDiv.innerHTML = '<p class="info-message">Tracking parcels, please wait...</p>';

    let allResultsHtml = ''; // To accumulate results for all CNs

    // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const parts = dateString.split('-'); // [YYYY, MM, DD]
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        }
        return dateString; // Return original if format is unexpected
    };

    for (const cn of consignmentNumbers) {
        try {
            const response = await fetch(`${backendBaseUrl}/track?consignment_number=${encodeURIComponent(cn)}`);
            const data = await response.json();

            if (response.ok) {
                const parcel = data;
                allResultsHtml += `
                    <div class="parcel-result">
                        <h3>Consignment Number: ${parcel.ConsignmentNumber}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Party Name</th>
                                    <th>Customer Name</th>
                                    <th>Pickup Location</th>
                                    <th>Destination</th>
                                    <th>Number Of Packets</th>
                                    <th>Status</th>
                                    <th>Pickup Date</th>
                                    <th>Delivery Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Party Name">${parcel.PartyName}</td>
                                    <td data-label="Customer Name">${parcel.CustomerName}</td>
                                    <td data-label="Pickup Location">${parcel.PickupLocation}</td>
                                    <td data-label="Destination">${parcel.Destination}</td>
                                    <td data-label="Number Of Packets">${parcel.NumberOfPackets}</td>
                                    <td data-label="Status">${parcel.Status}</td>
                                    <td data-label="Pickup Date">${formatDate(parcel.PickupDate)}</td>
                                    <td data-label="Delivery Date">${formatDate(parcel.DeliveryDate)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                allResultsHtml += `<p class="error-message">Consignment Number "${cn}" not found or error: ${data.error || data.message || 'An unknown error occurred.'}</p>`;
            }
        } catch (error) {
            console.error(`Error fetching tracking data for ${cn}:`, error);
            allResultsHtml += `<p class="error-message">Failed to connect to the tracking service for "${cn}". Please check your internet connection or try again later.</p>`;
        }
    }
    trackingResultsDiv.innerHTML = allResultsHtml; // Display all accumulated results
});

// Optional: Add a simple function to demonstrate creating a consignment (for testing)
// This won't be exposed on the frontend directly but good for understanding POST requests
async function createDummyConsignment() {
    const newConsignmentData = {
        "ConsignmentNumber": "NEW12345",
        "PartyName": "New Client",
        "CustomerName": "New Customer",
        "PickupLocation": "Source City",
        "Destination": "Target City",
        "NumberOfPackets": 1,
        "Status": "Booked",
        "PickupDate": "2025-05-26",
        "DeliveryDate": null
    };
    const backendBaseUrl = 'https://8c92-103-225-176-192.ngrok-free.app'; // <<-- Confirm this is correct for your setup

    try {
        const response = await fetch(`${backendBaseUrl}/consignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newConsignmentData),
        });
        const data = await response.json();
        console.log('Create Consignment Response:', data);
    } catch (error) {
        console.error('Error creating consignment:', error);
    }
}

// You can call createDummyConsignment() in your browser's console for testing the POST endpoint
// e.g., in Chrome DevTools (F12), go to Console tab and type: createDummyConsignment()
