
const decode  = (value) =>{
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.innerText || div.textContent;
};

export default decode;
