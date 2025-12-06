let eventBeingEdited = null;

function updateLocationOptions(modality) {
  const mode = modality || document.getElementById('event_modality').value;

  const locationGroup = document.getElementById('location_group');
  const remoteGroup = document.getElementById('remote_group');
  const loc = document.getElementById('event_location');
  const url = document.getElementById('event_remote_url');

  if (mode === "in-person") {
    locationGroup.classList.remove("d-none");
    remoteGroup.classList.add("d-none");
    loc.required = true;
    url.required = false;
  } else {
    locationGroup.classList.add("d-none");
    remoteGroup.classList.remove("d-none");
    loc.required = false;
    url.required = true;
  }
}

function isValidURL(url) {
  const re = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
  return re.test(url);
}

function saveEvent() {
  const form = document.getElementById("data-form");
  if (!form.reportValidity()) return;

  const newData = {
    id: eventBeingEdited?.id ?? crypto.randomUUID(),
    name: document.getElementById("event_name").value.trim(),
    weekday: document.getElementById("event_weekday").value,
    time: document.getElementById("event_time").value,
    category: document.getElementById("category").value,
    modality: document.getElementById("event_modality").value,
    location: document.getElementById("event_location").value.trim(),
    remote_url: document.getElementById("event_remote_url").value.trim(),
    attendees: document.getElementById("event_attendees").value.trim()
  };

  if (newData.modality === "remote" && !isValidURL(newData.remote_url)) {
    alert("Enter a valid URL (example: https://zoom.com)");
    return;
  }

  if (eventBeingEdited) {
    updateEventCard(newData);
  } else {
    addEventToCalendarUI(newData);
  }

  eventBeingEdited = null;
  form.reset();
  updateLocationOptions("in-person");

  bootstrap.Modal.getInstance(document.getElementById("event_modal")).hide();
}

function updateEventCard(updated) {
  const oldCard = document.querySelector(`[data-id="${updated.id}"]`);
  if (oldCard) oldCard.remove();
  addEventToCalendarUI(updated);
}

function createEventCard(eventDetails) {
  const card = document.createElement("div");
  card.className = `event p-2 rounded mb-2 event--${eventDetails.category}`;
  card.dataset.id = eventDetails.id;

  card.innerHTML = `
    <strong>${eventDetails.name}</strong><br>
    <span>${eventDetails.time}</span><br>
    <span>${eventDetails.modality === "in-person" ? eventDetails.location : eventDetails.remote_url}</span>
  `;

  card.addEventListener("click", () => openEditModal(eventDetails));

  return card;
}

function addEventToCalendarUI(eventDetails) {
  const col = document.getElementById(eventDetails.weekday);
  col.appendChild(createEventCard(eventDetails));
}

function openEditModal(eventDetails) {
  eventBeingEdited = eventDetails;

  document.getElementById("event_name").value = eventDetails.name;
  document.getElementById("event_weekday").value = eventDetails.weekday;
  document.getElementById("event_time").value = eventDetails.time;
  document.getElementById("category").value = eventDetails.category;
  document.getElementById("event_modality").value = eventDetails.modality;
  document.getElementById("event_location").value = eventDetails.location;
  document.getElementById("event_remote_url").value = eventDetails.remote_url;
  document.getElementById("event_attendees").value = eventDetails.attendees;

  updateLocationOptions(eventDetails.modality);

  new bootstrap.Modal(document.getElementById("event_modal")).show();
}

document.addEventListener("DOMContentLoaded", () => {
  updateLocationOptions("in-person");
});
