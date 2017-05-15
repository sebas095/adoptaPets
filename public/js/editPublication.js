// Form
const form = document.getElementById('publication-form');
const inputs = form.elements;

// Buttons
const btnEdit = document.getElementById('edit');
const btnDelete = document.getElementById('delete');

// Disable inputs
for (let i = 0; i < inputs.length; i++) {
  if (!inputs[i].id.includes('edit') && !inputs[i].id.includes('delete'))
    inputs[i].disabled = true;
}

btnEdit.addEventListener('click', (ev) => {
  ev.preventDefault();
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].id.includes('edit') && !inputs[i].id.includes('delete'))
      inputs[i].disabled = !inputs[i].disabled;
  }
});

btnDelete.addEventListener('click', (ev) => {
  ev.preventDefault();
  if (confirm('¿Estas seguro que deseas borrar la publicación?')) {
    document.getElementById('deletePublicationForm').submit();
  }
});
