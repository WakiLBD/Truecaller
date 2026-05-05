const axios = require('axios');

exports.handler = async (event, context) => {
    // URL থেকে নম্বর প্যারামিটার নেওয়া
    const number = event.queryStringParameters.number;

    if (!number) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: 'নম্বর প্রদান করা হয়নি (Missing number parameter)' })
        };
    }

    const url = 'https://api.eyecon-app.com/app/getnames.jsp';
    const params = {
        cli: number,
        lang: 'en',
        is_callerid: 'true',
        is_ic: 'true',
        cv: 'vc_672_vn_4.2025.10.17.1932_a',
        requestApi: 'URLconnection',
        source: 'MenifaFragment'
    };

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        'accept': 'application/json',
        'e-auth-v': 'e1',
        'e-auth': 'c5f7d3f2-e7b0-4b42-aac0-07746f095d38', // এই টোকেনটি কাজ না করলে আপডেট করতে হবে
        'e-auth-c': '40',
        'e-auth-k': 'PgdtSBeR0MumR7fO',
        'accept-charset': 'UTF-8',
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Host': 'api.eyecon-app.com',
        'Connection': 'Keep-Alive'
    };

    try {
        const response = await axios.get(url, { 
            params, 
            headers,
            timeout: 15000 // ১৫ সেকেন্ড টাইমআউট
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS ফিক্স
                "Content-Type": "application/json"
            },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        // বিস্তারিত এরর লগ (এটি Netlify Functions Log-এ দেখা যাবে)
        console.error("Eyecon API Error Details:", {
            message: error.message,
            status: error.response ? error.response.status : 'No Response',
            data: error.response ? error.response.data : null
        });

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                error: 'API request failed', 
                message: error.message,
                details: error.response ? error.response.data : 'Server connectivity issue'
            })
        };
    }
};
