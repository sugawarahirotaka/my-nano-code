// OpenAIのChat Complettions APIを最小限呼び出し
async function callOpenAI() {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-5-mini',
            messages: [
                { role: 'user', content: 'TypeScriptについて簡潔に説明' }
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }
    // dataの型定義をして、as hogehogeでエラー消える
    const data = await response.json();
    // console.log(data.choices[0].message.content);
}

// 実行
// callOpenAI()
