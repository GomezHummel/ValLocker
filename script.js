// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Fetch skins data from API
    fetchSkinsData()
        .then(parseSkinsData)
        .then(skins => {
            // Render skins on the webpage
            renderSkins(skins);
        })
        .catch(error => {
            console.error('Error fetching skins data:', error);
        });
});

// Function to fetch skins data from API
async function fetchSkinsData() {
    const response = await fetch('https://valorant-api.com/v1/weapons/skins');
    const data = await response.json();
    return data.data;
}

// Function to parse skins data and create HTML elements
function parseSkinsData(skinsData) {
    const skins = skinsData.map((skin, index) => {
        // Exclude skins with "Standard" or "Random Favorite Skin" in their display names
        if (skin.displayName.includes('Standard') || skin.displayName.includes('Random Favorite Skin') || skin.displayName === 'Melee') {
            return '';
        }
        
        let category;
        if (index >= skinsData.findIndex(s => s.displayName === 'Task Force 809 Knife')) {
            category = 'Melee';
        } else {
            switch (true) {
                case /Classic|Shorty|Frenzy|Ghost|Sheriff/.test(skin.displayName):
                    category = 'Sidearms';
                    break;
                case /Stinger|Spectre/.test(skin.displayName):
                    category = 'SMGs';
                    break;
                case /Bucky|Judge/.test(skin.displayName):
                    category = 'Shotguns';
                    break;
                case /Bulldog|Guardian|Phantom|Vandal/.test(skin.displayName):
                    category = 'Rifles';
                    break;
                case /Marshal|Outlaw|Operator/.test(skin.displayName):
                    category = 'Sniper Rifles';
                    break;
                case /Ares|Odin/.test(skin.displayName):
                    category = 'Machine Guns';
                    break;
                case /Melee/.test(skin.displayName):
                    category = 'Melee Skins';
                    break;
                default:
                    category = 'Other';
            }
        }
        
        const imageUrl = skin.displayIcon || (skin.chromas.length > 0 ? skin.chromas[0].fullRender : null); // Use fullRender if displayIcon is null
        
        if (!imageUrl) {
            return ''; // Skip if both displayIcon and fullRender are null
        }
        
        return `
            <div class="skin-item" data-category="${category}">
                <img src="${imageUrl}" alt="${skin.displayName}" class="skin-image">
                <h3>${skin.displayName}</h3>
                <p>Category: ${category}</p>
            </div>
        `;
    });
    return skins.join('');
}


function toggleFilter() {
    var filterDropdown = document.getElementById("filterDropdown");
    if (filterDropdown.style.display === "block") {
        filterDropdown.style.display = "none";
    } else {
        filterDropdown.style.display = "block";
    }
}

function filterSkins() {
    var categories = document.getElementsByName("category");
    var skins = document.getElementsByClassName("skin-item");
    var anyChecked = false;

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].checked) {
            anyChecked = true;
            break;
        }
    }

    if (!anyChecked) {
        for (var i = 0; i < skins.length; i++) {
            skins[i].style.display = "block";
        }
        return;
    }

    for (var i = 0; i < skins.length; i++) {
        skins[i].style.display = "block";
    }

    for (var i = 0; i < categories.length; i++) {
        if (!categories[i].checked) {
            var categorySkins = document.querySelectorAll(`[data-category="${categories[i].value}"]`);
            categorySkins.forEach(skin => {
                skin.style.display = "none";
            });
        }
    }
}


// Function to render skins on the webpage
function renderSkins(skinsHTML) {
    const skinsContainer = document.getElementById('skins');
    skinsContainer.innerHTML = skinsHTML;
}
