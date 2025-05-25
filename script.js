document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.file-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const fileType = this.dataset.file;
            document.getElementById('hppContent').style.display = 'none';
            document.getElementById('cppContent').style.display = 'none';
            document.getElementById('guideContent').style.display = 'none';
            
            // Show/hide copy button based on tab
            const copyBtn = document.querySelector('.copy-btn');
            if (fileType === 'guide') {
                copyBtn.style.display = 'none';
            } else {
                copyBtn.style.display = 'block';
            }
            
            if (fileType === 'hpp') {
                document.getElementById('hppContent').style.display = 'block';
            } else if (fileType === 'cpp') {
                document.getElementById('cppContent').style.display = 'block';
            } else if (fileType === 'guide') {
                document.getElementById('guideContent').style.display = 'block';
            }
        });
    });
    
    // Generate button click
    document.getElementById('generateBtn').addEventListener('click', function() {
        const contractAccount = document.getElementById('contractAccount').value.trim();
        
        if (!contractAccount) {
            alert('Please enter your contract account name');
            return;
        }
        
        // Validate EOSIO account name format
        if (!/^[a-z1-5.]{1,12}$/.test(contractAccount)) {
            alert('Invalid EOSIO account name. Must be 1-12 characters (a-z, 1-5, .)');
            return;
        }
        
        // Generate customized files
        generateFiles(contractAccount);
        
        // Update tab names with actual contract name
        document.querySelector('[data-file="hpp"]').textContent = `${contractAccount}.hpp`;
        document.querySelector('[data-file="cpp"]').textContent = `${contractAccount}.cpp`;
        
        // Show output section
        const outputSection = document.getElementById('outputSection');
        outputSection.style.display = 'block';
        
        // Scroll to and focus the output section
        outputSection.scrollIntoView({ behavior: 'smooth' });
        outputSection.setAttribute('tabindex', '-1');
        outputSection.focus();
    });
});

function generateFiles(contractAccount) {
    // Generate .hpp file
    const hppContent = `#include <eosio/eosio.hpp>\n\nusing namespace eosio;\n\nclass [[eosio::contract("${contractAccount}")]] ${contractAccount} : public contract {\npublic:\n    // Minimal RAM cleaner constructor\n    ${contractAccount}(name receiver, name code, datastream<const char*> ds) \n    : contract(receiver, code, ds) {}\n\n    // Action to remove contract and free RAM\n    [[eosio::action]] void remove();\n};`;
    
    // Generate .cpp file with contractName comment
    const cppContent = `#include "${contractAccount}.hpp"\n//contractName:${contractAccount}\n\nvoid ${contractAccount}::remove() {\n    // Only the contract account itself can remove it\n    require_auth(get_self());\n    \n    // This will completely remove the contract and free RAM\n    print("Removing contract ", get_self(), " and freeing RAM. This action is irreversible!");\n}\n\n// Apply handler for the remove action\nextern "C" void apply(uint64_t r, uint64_t c, uint64_t a) {\n    if (r == c) {\n        ${contractAccount} inst(name(r), name(c), datastream<const char*>(nullptr, 0));\n        if (a == "remove"_n.value) {\n            inst.remove();\n        }\n    }\n}`;
    
    // Generate deployment guide
    const guideContent = `
        <div class="guide">
            <h3>How to Deploy Your RAM Cleaner Contract</h3>
            <p>Follow these steps to deploy your contract and free RAM from your unused Vaulta contract:</p>
            
            <div class="guide-step">
                <span class="guide-step-number">1</span>
                <strong>Save Your Contract Files</strong>
                <p>Copy the generated files above and save them as <code>${contractAccount}.hpp</code> and <code>${contractAccount}.cpp</code> in a new folder.</p>
            </div>
            
            <div class="guide-step">
                <span class="guide-step-number">2</span>
                <strong>Open Vaulta Web IDE</strong>
                <p>Go to <a href="https://ide.eosnetwork.com/" target="_blank">Vaulta WEB IDE</a> and connect your Anchor Wallet with the account that owns the contract.</p>
            </div>
            
            <div class="guide-step">
                <span class="guide-step-number">3</span>
                <strong>Create New Project</strong>
                <p>In Vaulta IDE, create a new EOSIO contract project and upload your two contract files.</p>
            </div>
            
            <div class="guide-step">
                <span class="guide-step-number">4</span>
                <strong>Compile the Contract</strong>
                <p>Click the "Compile" button in Vaulta to build your RAM cleaner contract.</p>
            </div>
            
            <div class="danger-step">
                <span class="guide-step-number">5</span>
                <strong>Deploy to Blockchain (Irreversible!)</strong>
                <p>Once compiled successfully, click "Deploy" and select your contract account (${contractAccount}) when prompted by Anchor Wallet.</p>
                <p>This will overwrite your existing Vaulta contract.</p>
            </div>
            
            <div class="guide-step">
                <span class="guide-step-number">6</span>
                <strong>Execute the RAM Cleaner</strong>
                <p>After deployment, execute the remove action:</p>
                <pre>cleos push action ${contractAccount} remove '[]' -p ${contractAccount}@active</pre>
                <p>Or use the Vaulta interface to send the action.</p>
            </div>
            
            <div class="warning">
                <h4>Important Notes</h4>
                <ul>
                    <li>This action is permanent and cannot be undone</li>
                    <li>All contract data and code will be deleted</li>
                    <li>RAM will be returned to the contract account owner</li>
                    <li>Make sure you have backups of any important data</li>
                </ul>
            </div>
        </div>
    `;
    
    // Display the generated content
    document.getElementById('hppContent').textContent = hppContent;
    document.getElementById('cppContent').textContent = cppContent;
    document.getElementById('guideContent').innerHTML = guideContent;
}

function copyToClipboard() {
    const activeTab = document.querySelector('.file-tab.active');
    const fileType = activeTab.dataset.file;
    let contentToCopy;
    
    if (fileType === 'hpp') {
        contentToCopy = document.getElementById('hppContent');
    } else if (fileType === 'cpp') {
        contentToCopy = document.getElementById('cppContent');
    } else {
        return; // No action for guide tab
    }
    
    const range = document.createRange();
    range.selectNode(contentToCopy);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('Copied to clipboard!');
        } else {
            alert('Failed to copy. Please try again.');
        }
    } catch (err) {
        alert('Error copying text: ' + err);
    }
    
    window.getSelection().removeAllRanges();
}
function copyDonationAddress() {
    navigator.clipboard.writeText('donatetodev1')
        .then(() => alert('Donation address copied! Thank you for your support ❤️'))
        .catch(err => console.error('Failed to copy:', err));
}
