import Gateway from "micromq/gateway";

const app= new Gateway({
  microservices: ['users'],
  rabbit: {
    url: 'http://localhost:5672/',
  },
});


app.get(['/friends', '/status'], async (req, res) => {
  await res.delegate('users');
});

app.listen(process.env.PORT||5000,()=>{console.log('port 5000')});