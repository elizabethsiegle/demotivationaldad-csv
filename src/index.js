import html from '../static/index.html';
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === 'GET' && url.pathname === '/') {
            return new Response(html, {
                headers: { 'Content-Type': 'text/html' },
            });
        } else if (request.method === 'POST' && url.pathname === '/strava') {
            const { csvContent } = await request.json();
            let messages = [
				{ role: "system", content: "You are a helpful assistant" },
				{
				  role: "user",
				  content: `Summarize the following: ${csvContent}.`,
				},
			  ];
			console.log(`csvContent ${csvContent}`);
            const response = await env.AI.run(
                "@cf/meta/llama-3.1-8b-instruct", {
					max_tokens: 2048,
                	messages: messages
			});
            console.log(`output from first llm call ${JSON.stringify(response["response"])}`);
			const resp1 = JSON.stringify(response["response"]);
			messages = [
				{ role: "system", content: "You are a disappointed dad" },
				{
				  role: "user",
				  content: `Use the following summary to generate a reverse motivational message: ${resp1}. Do not include any back slashes.`,
				},
			  ];
            const response2 = await env.AI.run(
                '@cf/mistral/mistral-7b-instruct-v0.2-lora', {
					max_tokens: 2048,
                	messages: messages 
				}
              );
            console.log(JSON.stringify(response2["response"]));
            return new Response(JSON.stringify(response2["response"]), {
                headers: { 'Content-Type': 'application/json' },
            });
		}
        // } else if (request.method === 'POST' && url.pathname === '/stravaimg') { 
		// 	const { p } = await request.json();
		// 	console.log(p);
		// 	const inputs = {
		// 		prompt: `Based on the following disappointed dad shpiel, generate an inspirational image: ${p}`,
		// 	  };
		  
		// 	  const response = await env.AI.run(
		// 		"@cf/bytedance/stable-diffusion-xl-lightning",
		// 		inputs
		// 	  );
		  
		// 	  return new Response(response, {
		// 		headers: {
		// 		  "content-type": "image/png",
		// 		},
		// 	  });
		// }
        return new Response('Not found', { status: 404 });
    }
}
