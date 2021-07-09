const button= document.querySelector("button")

button.addEventListener('click', async () => {
    const result = await fetch("https://randomuser.me/api/",{
        method: "GET"
    })
    const data= await result.json()
    console.log(data);
})