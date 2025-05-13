/**
 * Admin Panel JavaScript
 */

// Enable Bootstrap tooltips
document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  // Initialize any datepickers
  if (typeof flatpickr !== 'undefined') {
    flatpickr('.datepicker', {
      dateFormat: 'd/m/Y',
      locale: 'vn'
    });

    flatpickr('.datetimepicker', {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      time_24hr: true,
      locale: 'vn'
    });
  }

  // Image preview functionality
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  
  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', function() {
      if (this.files?.[0]) {
        const reader = new FileReader();
        
        reader.onload = e => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        }
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // Initialize WYSIWYG editor if available
  if (typeof ClassicEditor !== 'undefined') {
    ClassicEditor
      .create(document.querySelector('#content'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'],
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
          ]
        },
        image: {
          toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}); 