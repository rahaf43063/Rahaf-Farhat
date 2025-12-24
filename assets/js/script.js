document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrengthBar = document.getElementById('passwordStrength');
    const successModal = document.getElementById('successModal');
    const togglePasswordBtn = document.getElementById('togglePassword');

    // Toggle password visibility
    if (togglePasswordBtn && password) {
        togglePasswordBtn.addEventListener('click', function () {
            const isPassword = password.type === 'password';
            password.type = isPassword ? 'text' : 'password';
            this.innerHTML = isPassword ?
                '<i class="fas fa-eye-slash"></i>' :
                '<i class="fas fa-eye"></i>';
        });
    }

    function validateField(input, errorId, isValid, errorMsg) {
        if (!input) return false;
        
        const errorEl = document.getElementById(errorId);
        const parentEl = input.closest('.group');
        const hasError = !isValid;
        
        if (errorEl) {
            if (hasError) {
                errorEl.textContent = errorMsg;
                errorEl.classList.add('show-error');
                void errorEl.offsetHeight;
                errorEl.style.height = errorEl.scrollHeight + 'px';
            } else {
                errorEl.style.height = '0';
                setTimeout(() => errorEl.classList.remove('show-error'), 200);
            }
        }

        if (parentEl) {
            parentEl.classList.toggle('invalid', hasError);
        }
        input.classList.toggle('border-red-500', hasError);
        
        return !hasError;
    }

    // Password strength indicator
    if (password && passwordStrengthBar) {
        passwordStrengthBar.className = 'h-0.5 mt-1 bg-gray-400 transition-all duration-300';

        password.addEventListener('input', function () {
            const val = this.value;
            let width = '0%';
            let strengthClass = 'bg-gray-400';
            let strength = 0;

            if (val.length > 0) {
                const hasUpperCase = /[A-Z]/.test(val);
                const hasLowerCase = /[a-z]/.test(val);
                const hasNumbers = /\d/.test(val);
                const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(val);

                strength = 0; // Reset strength
                if (val.length >= 4) strength++;
                if (val.length >= 8) strength++;
                if (hasUpperCase) strength++;
                if (hasLowerCase) strength++;
                if (hasNumbers) strength++;
                if (hasSpecialChars) strength += 2;

                if (strength <= 1) {
                    width = '30%';
                    strengthClass = 'bg-red-500';
                } else if (strength <= 3) {
                    width = '65%';
                    strengthClass = 'bg-yellow-400';
                } else {
                    width = '100%';
                    strengthClass = 'bg-green-500';
                }
            }

            passwordStrengthBar.style.width = width;
            passwordStrengthBar.className = `h-0.5 mt-1 transition-all duration-300 ${strengthClass}`;

            const strengthTextEl = document.getElementById('passwordStrengthText');
            if (strengthTextEl) {
                if (val.length === 0) {
                    strengthTextEl.textContent = '';
                } else if (strength <= 1) {
                    strengthTextEl.textContent = 'Very Weak';
                    strengthTextEl.className = 'text-xs text-red-500 mt-1';
                } else if (strength <= 3) {
                    strengthTextEl.textContent = 'Medium';
                    strengthTextEl.className = 'text-xs text-yellow-400 mt-1';
                } else {
                    strengthTextEl.textContent = 'Strong';
                    strengthTextEl.className = 'text-xs text-green-500 mt-1';
                }
            }
        });
    }

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate all fields
        const isFirstNameValid = validateField(
            firstName,
            'firstnameError',
            firstName.value.trim() !== '',
            "First name is required"
        );

        const isLastNameValid = validateField(
            lastName,
            'lastnameError',
            lastName.value.trim() !== '',
            "Last name is required"
        );

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = validateField(
            email,
            'emailError',
            emailRegex.test(email.value),
            "Please enter a valid email address"
        );

        const isPasswordValid = validateField(
            password,
            'passwordError',
            password.value.length >= 6,
            "Password must be at least 6 characters"
        );

        const isConfirmValid = validateField(
            confirmPassword,
            'confirmPasswordError',
            confirmPassword.value === password.value,
            "Passwords do not match"
        );

        // If all validations pass, show success modal
        if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
            if (successModal) {
                successModal.classList.remove('hidden');
                successModal.classList.add('flex');
                form.reset();
                if (passwordStrengthBar) {
                    passwordStrengthBar.style.width = '0%';
                }
            }
        }
    });

    // Real-time validation for fields
    const fields = [
        { element: firstName, errorId: 'firstnameError', validate: (val) => val.trim() !== '', message: 'First name is required' },
        { element: lastName, errorId: 'lastnameError', validate: (val) => val.trim() !== '', message: 'Last name is required' },
        {
            element: email,
            errorId: 'emailError',
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            message: 'Please enter a valid email address'
        },
        {
            element: password,
            errorId: 'passwordError',
            validate: (val) => val.length >= 6,
            message: 'Password must be at least 6 characters'
        },
        {
            element: confirmPassword,
            errorId: 'confirmPasswordError',
            validate: (val) => val === password.value,
            message: 'Passwords do not match'
        }
    ];

    fields.forEach(field => {
        if (field.element) {
            field.element.addEventListener('input', () => {
                validateField(
                    field.element,
                    field.errorId,
                    field.validate(field.element.value),
                    field.message
                );
            });
        }
    });
});

// Close success modal
function closeModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
    }
}