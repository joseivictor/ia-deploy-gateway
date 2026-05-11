exports.handler = async (event) => {
  const secret = event.queryStringParameters.secret;
  const template = event.queryStringParameters.template;

  if (secret !== process.env.GATEWAY_SECRET) {
    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }

  let html = "";

  if (template === "shooter") {
    html = `
<!DOCTYPE html>
<html>
<head>
<title>Jogo de Tiro</title>
<style>
body{
  margin:0;
  overflow:hidden;
  background:black;
}
#player{
  width:50px;
  height:50px;
  background:red;
  position:absolute;
  bottom:20px;
  left:50%;
}
.bullet{
  width:6px;
  height:20px;
  background:yellow;
  position:absolute;
}
</style>
</head>
<body>

<div id="player"></div>

<script>
const player = document.getElementById("player");

document.addEventListener("mousemove",(e)=>{
  player.style.left = e.clientX + "px";
});

document.addEventListener("click",()=>{
  const bullet = document.createElement("div");
  bullet.className="bullet";

  bullet.style.left = player.offsetLeft + 22 + "px";
  bullet.style.top = window.innerHeight - 70 + "px";

  document.body.appendChild(bullet);

  const interval = setInterval(()=>{
    bullet.style.top = bullet.offsetTop - 10 + "px";

    if(bullet.offsetTop < 0){
      bullet.remove();
      clearInterval(interval);
    }
  },20);
});
</script>

</body>
</html>
`;
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: html,
  };
};
