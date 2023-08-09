//Connect Check
console.log("JS has been connected");
let revenue = 0;


//Grab buttons and info from html
let allLookupBtn = document.getElementById('allInvLookup');
let garmetNameAdd = document.querySelector('#garmetName_id');
let garmetSizeAdd = document.querySelector('#addGarmet-size');
let garmetSeasonAdd = document.querySelector('#addGarmet-season');
let garmetDeptAdd = document.querySelector('#addGarmet-dept')
let sellingPriceAdd = document.querySelector('#addGarmet-selling');
let purchasedPriceAdd = document.querySelector('#addGarmet-purchased');
let aquiredFromAdd = document.querySelector('#addGarmet-aquired');
let addInventoryBtn = document.querySelector('#addInvbutton');
let referenceNumberLookup = document.querySelector('#referenceNum');
let searchBtn = document.querySelector('#searchBtn');




function showInteractiveBox(garment) {
    const interactiveBox = document.querySelector('.interactive-box');
    const interactiveBoxContent = document.querySelector('.interactive-box-content');
    interactiveBoxContent.innerHTML = `
    <h2>Garment Added Successfully</h2>
    <p><strong>Name:</strong> ${garment.name}</p>
    <p><strong>Size:</strong> ${garment.size}</p>
    <p><strong>Season:</strong> ${garment.season}</p>
    <p><strong>Department:</strong> ${garment.department}</p>
    <p><strong>Selling Price:</strong> $${garment.price}</p>
    <p><strong>Reference Number:</strong> ${garment.referenceNum}</p>
    <button class="sell-button">Sell</button>
    <button class="ok-button">OK</button>
    `;

    interactiveBox.style.display = 'block';
    
    const sellButton = interactiveBoxContent.querySelector('.sell-button');
    const okButton = interactiveBoxContent.querySelector('button.ok-button');

    okButton.addEventListener('click', hideInteractiveBox);
    
    sellButton.addEventListener('click', () => {
        revenue = revenue + garment.netProfit;
        alert(`Total Daily Profit: $${revenue}`);
        hideInteractiveBox();
    });

    };





function hideInteractiveBox() {
    const interactiveBox = document.querySelector('.interactive-box');
    interactiveBox.style.display = 'none';
}


//FUNCTIONS

let num = 5;

//add Garmet function
addInventoryBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if(
        garmetNameAdd.value == '' ||
        garmetSizeAdd.value == '' ||
        garmetDeptAdd.value == '' ||
        sellingPriceAdd.value == ''
    ){
        alert('Please fill out all required fields, mom!!');
        return;
    }
    num ++;
    let newGarmet = {
        name: garmetNameAdd.value,
        size: garmetSizeAdd.value,
        season: garmetSeasonAdd.value,
        department: garmetDeptAdd.value,
        price: sellingPriceAdd.value,
        purchased: purchasedPriceAdd.value,
        aquired: aquiredFromAdd.value,
        netProfit: parseFloat(sellingPriceAdd.value) - parseFloat(purchasedPriceAdd.value),
        referenceNum: num.toString().padStart(3, '0')
    };
    console.log(newGarmet);
    axios
        .post('http://localhost:5050/api/garmentAdd', newGarmet)
        .then(res => {
            console.log(res.data);
            garmetNameAdd.value = '';
            garmetSizeAdd.value = '';
            garmetSeasonAdd.value = '';
            garmetDeptAdd.value = '';
            sellingPriceAdd.value = '';
            purchasedPriceAdd.value = '';
            aquiredFromAdd.value = '';
            showInteractiveBox(newGarmet);
            const okButton = document.querySelector('.interactive-box-content button');
            okButton.addEventListener('click', hideInteractiveBox);
        } 
        )
});


//Show all Inventory button
allLookupBtn.addEventListener('click', () => {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('inventoryContent').style.display = 'block';
    axios
        .get('http://localhost:5050/api/inventory')
        .then(res => {
            const inventory = res.data;
            const inventoryContainer = document.getElementById('inventoryContent');
            
            inventoryContainer.innerHTML = ''; // Clear previous content

            inventory.forEach(garment => {
                const garmentBox = document.createElement('div');
                garmentBox.classList.add('garment-box');
                garmentBox.innerHTML = `
                    <h2>${garment.name}</h2>
                    <p><strong>Size:</strong> ${garment.size}</p>
                    <p><strong>Season:</strong> ${garment.season}</p>
                    <p><strong>Department:</strong> ${garment.department}</p>
                    <p><strong>Price: $</strong> ${garment.price}</p>
                    <p><strong>Reference Number: </strong> ${garment.referenceNum}</p>
                    
                `;
                inventoryContainer.appendChild(garmentBox);
            });
        })
        .catch(error => console.log(error));
        }
);

//Lookup garmet by reference number
searchBtn.addEventListener('click', () => {

    if(referenceNumberLookup.value !== "") {
            axios
                .get(`http://localhost:5050/api/inventory/${referenceNumberLookup.value}`)
                .then(res => console.log(res.data))
                .catch(error => console.log(error))
    }else {
    console.log("Fill in a search criteria!")
}
});



// Lookup garmet by reference number
searchBtn.addEventListener('click', () => {
    if (referenceNumberLookup.value !== "") {
        axios
            .get(`http://localhost:5050/api/inventory/${referenceNumberLookup.value}`)
            .then(res => {
                console.log(res.data);
                showInteractiveBox(res.data);
                const okButton = document.querySelector('.interactive-box-content button');
                okButton.addEventListener('click', hideInteractiveBox);
            })
            .catch(error => console.log(error))
    } else {
        alert("please give a reference number!")
    }
})





let mainLink = document.getElementById('mainLink');


mainLink.addEventListener('click', () => {
    window.location.href = 'index.html';
});
