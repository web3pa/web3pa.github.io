document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.file-tab');
    const outputSection = document.getElementById('outputSection');
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const fileType = this.dataset.file;
            document.getElementById('hppContent').classList.toggle('hidden', fileType !== 'hpp');
            document.getElementById('cppContent').classList.toggle('hidden', fileType !== 'cpp');
            document.getElementById('guideContent').classList.toggle('hidden', fileType !== 'guide');
            
            // Hide copy button for guide tab
            document.querySelector('.copy-btn').style.display = fileType === 'guide' ? 'none' : 'block';
        });
    });
    
    // Generate button click
    document.getElementById('generateBtn').addEventListener('click', function() {
        const contractAccount = document.getElementById('contractAccount').value.trim();
        
        if (!contractAccount) {
            alert('Please enter your contract account name');
            return;
        }
        
        if (!/^[a-z1-5.]{1,12}$/.test(contractAccount)) {
            alert('Account name must be 1-12 characters (a-z, 1-5, .)');
            return;
        }
        
        generateFiles(contractAccount);
        
        // Update UI
        document.querySelector('[data-file="hpp"]').textContent = `${contractAccount}.hpp`;
        document.querySelector('[data-file="cpp"]').textContent = `${contractAccount}.cpp`;
        
        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth' });
        outputSection.tabIndex = -1;
        outputSection.focus();
    });
});

function generateFiles(contractAccount) {
    // Generate .hpp file
    const hppContent = `#include <eosio/eosio.hpp>\n\nusing namespace eosio;\n\nclass [[eosio::contract("${contractAccount}")]] ${contractAccount} : public contract {\npublic:\n    ${contractAccount}(name receiver, name code, datastream<const char*> ds) \n    : contract(receiver, code, ds) {}\n\n    [[eosio::action]] void remove();\n};`;
    
    // Generate .cpp file
    const cppContent = `#include "${contractAccount}.hpp"\n//contractName:${contractAccount}\n\nvoid ${contractAccount}::remove() {\n    require_auth(get_self());\n    print("Removing contract ", get_self(), " and freeing RAM");\n}\n\nextern "C" void apply(uint64_t r, uint64_t c, uint64_t a) {\n    if (r == c) {\n        ${contractAccount} inst(name(r), name(c), datastream<const char*>(nullptr, 0));\n        if (a == "remove"_n.value) {\n            inst.remove();\n        }\n    }\n}`;
    
    // Generate guide
    const guideContent = `
        <div class="guide">
            <h3>Deployment Guide</h3>
            <ol>
                <li>Save files as <strong>${contractAccount}.hpp</strong> and <strong>${contractAccount}.cpp</strong></li>
                <li>Open <a href="https://vaulta.io" target="_blank">Vaulta Web IDE</a></li>
                <li>Create new project and upload files</li>
                <li>Compile and deploy</li>
                <li>Execute: <code>cleos push action ${contractAccount} remove '[]' -p ${contractAccount}@active</code></li>
            </ol>
            <div class="warning">
                <p><strong>⚠️ Warning:</strong> This will permanently delete your contract and free RAM (expect <20kb remaining).</p>
            </div>
        </div>
    `;
    
    document.getElementById('hppContent').textContent = hppContent;
    document.getElementById('cppContent').textContent = cppContent;
    document.getElementById('guideContent').innerHTML = guideContent;
}

function copyToClipboard() {
    const activeTab = document.querySelector('.file-tab.active');
    const fileType = activeTab.dataset.file;
    let content;
    
    if (fileType === 'hpp') content = document.getElementById('hppContent');
    else if (fileType === 'cpp') content = document.getElementById('cppContent');
    else return;
    
    navigator.clipboard.writeText(content.textContent)
        .then(() => alert('Copied to clipboard!'))
        .catch(err => alert('Failed to copy: ' + err));
}

function copyDonationAddress() {
    navigator.clipboard.writeText('donatetodev1')
        .then(() => alert('Donation address copied! Thank you for your support ❤️'))
        .catch(err => console.error('Failed to copy:', err));
}