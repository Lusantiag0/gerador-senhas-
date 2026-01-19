// Password Generator Logic
class PasswordGenerator {
    constructor() {
        this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
        this.numbers = '0123456789';
        this.symbols = '!@#$%&*()-_=+[]{}<>?';
        this.history = this.loadHistory();

        this.initializeElements();
        this.attachEventListeners();
        this.updateLengthDisplay();
        this.renderHistory();
    }

    initializeElements() {
        this.passwordText = document.getElementById('passwordText');
        this.copyBtn = document.getElementById('copyBtn');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.uppercaseCheck = document.getElementById('uppercaseCheck');
        this.lowercaseCheck = document.getElementById('lowercaseCheck');
        this.numbersCheck = document.getElementById('numbersCheck');
        this.symbolsCheck = document.getElementById('symbolsCheck');
        this.generateBtn = document.getElementById('generateBtn');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        this.lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Generate password on Enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.generatePassword();
            }
        });

        // Update strength when options change
        [this.uppercaseCheck, this.lowercaseCheck, this.numbersCheck, this.symbolsCheck].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (this.passwordText.textContent !== 'Clique em gerar') {
                    this.updateStrength(this.passwordText.textContent);
                }
            });
        });
    }

    updateLengthDisplay() {
        this.lengthValue.textContent = this.lengthSlider.value;
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const useUppercase = this.uppercaseCheck.checked;
        const useLowercase = this.lowercaseCheck.checked;
        const useNumbers = this.numbersCheck.checked;
        const useSymbols = this.symbolsCheck.checked;

        // Validate at least one option is selected
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            this.showToast('⚠️ Selecione pelo menos um tipo de caractere!');
            return;
        }

        // Build character set
        let charset = '';
        if (useUppercase) charset += this.uppercase;
        if (useLowercase) charset += this.lowercase;
        if (useNumbers) charset += this.numbers;
        if (useSymbols) charset += this.symbols;

        // Generate password
        let password = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        // Display password with animation
        this.passwordText.style.opacity = '0';
        setTimeout(() => {
            this.passwordText.textContent = password;
            this.passwordText.style.opacity = '1';
            this.updateStrength(password);
            this.addToHistory(password);
        }, 150);
    }

    updateStrength(password) {
        let strength = 0;
        const length = password.length;

        // Length score
        if (length >= 8) strength += 20;
        if (length >= 12) strength += 20;
        if (length >= 16) strength += 20;

        // Variety score
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 10;
        if (/[0-9]/.test(password)) strength += 10;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

        // Update strength bar
        this.strengthFill.style.width = strength + '%';

        // Update color and text
        let strengthLabel = '';
        let strengthColor = '';

        if (strength < 40) {
            strengthLabel = 'Fraca';
            strengthColor = 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)';
        } else if (strength < 70) {
            strengthLabel = 'Média';
            strengthColor = 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)';
        } else if (strength < 90) {
            strengthLabel = 'Forte';
            strengthColor = 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)';
        } else {
            strengthLabel = 'Muito Forte';
            strengthColor = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        }

        this.strengthFill.style.background = strengthColor;
        this.strengthText.textContent = `Força: ${strengthLabel} (${strength}%)`;
    }

    async copyPassword() {
        const password = this.passwordText.textContent;

        if (password === 'Clique em gerar') {
            this.showToast('⚠️ Gere uma senha primeiro!');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.showToast('✓ Senha copiada com sucesso!');

            // Button animation
            this.copyBtn.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                this.copyBtn.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
        } catch (err) {
            this.showToast('❌ Erro ao copiar senha');
        }
    }

    addToHistory(password) {
        // Add to beginning of history
        this.history.unshift({
            password: password,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 passwords
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-history">Nenhuma senha gerada ainda</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item" style="animation-delay: ${index * 0.05}s">
                <span class="history-password">${item.password}</span>
                <button class="history-copy-btn" onclick="passwordGen.copyHistoryPassword('${item.password}')">
                    Copiar
                </button>
            </div>
        `).join('');
    }

    async copyHistoryPassword(password) {
        try {
            await navigator.clipboard.writeText(password);
            this.showToast('✓ Senha copiada!');
        } catch (err) {
            this.showToast('❌ Erro ao copiar');
        }
    }

    clearHistory() {
        if (this.history.length === 0) {
            this.showToast('⚠️ Histórico já está vazio');
            return;
        }

        if (confirm('Deseja realmente limpar todo o histórico?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showToast('✓ Histórico limpo!');
        }
    }

    saveHistory() {
        localStorage.setItem('passwordHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('passwordHistory');
        return saved ? JSON.parse(saved) : [];
    }

    showToast(message) {
        this.toastMessage.textContent = message;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.passwordGen = new PasswordGenerator();

    // Add smooth transitions to password text
    const passwordText = document.getElementById('passwordText');
    passwordText.style.transition = 'opacity 0.3s ease';
});
