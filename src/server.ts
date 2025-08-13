import Fastify from "fastify";
import {z} from "zod";

const app = Fastify({ logger: true});

// get route
app.get("/hello", async () => {
    return {message: "Hello World!"};
});

// Post route w/ validation
app.post("/user", async (request, reply) => {
    const schema = z.object({
        //what does a valid request body look like? ~~
        name: z.string().min(1),        //non empty string
        age: z.number().int().min(0)    //any integer >= 0
    });

    //check matching req body to schema 
    const parsed = schema.safeParse(request.body);

    // check fail state
    if(!parsed.success) {
        reply.code(400);
        return{error: parsed.error.format()};
    }

    //otherwise respond with success 
    const {name, age} = parsed.data;

    return {message: `User ${name} (${age}) created!`};
});


// start & listen on port 3000
app.listen({port:3000}).then(addr => {
    // log server addr when running correctly
    app.log.info(`Server running at: ${addr}`);
}).catch(err=>{ // log error and exit
    app.log.error(err);
    process.exit(1);
});