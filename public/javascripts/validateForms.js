(() => {
    'use strict'
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')
    const input = document.querySelector('#image');
    
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }
    
        form.classList.add('was-validated')
        }, false)
    })

    input.addEventListener('change', (e) => {
        // Retrieve all files
        const files = input.files;
    
        // Check files count
        if (files.length > 4) {
            alert(`Only 4 files are allowed to upload.`);
            input.value = [];
            return;
        }
    
        // TODO: continue uploading on server
    });
})()
