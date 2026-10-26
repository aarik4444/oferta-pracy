export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не поддерживается' });
    }

    const { name, email, message } = req.body;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Portal Pracy", email: "aarik4444@gmail.com" }, 
                to: [{ email: "email_учителя@school.pl", name: "Nauczyciel" }],   // <--- СЮДА придет письмо
                subject: `Nowa aplikacja na stanowisko od: ${name}`,
                htmlContent: `
                    <h3>Nowe zgłoszenie o pracę!</h3>
                    <p><strong>Imię i nazwisko:</strong> ${name}</p>
                    <p><strong>Email kandydata:</strong> ${email}</p>
                    <p><strong>Wiadomość / CV:</strong></p>
                    <p>${message}</p>
                `
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const data = await response.json();
            return res.status(500).json({ success: false, error: data });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
