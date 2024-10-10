let id = 0;
let data = []; // Declare data array to store entries
let icon = document.getElementsByClassName("icon")[0];
let url = document.getElementById("website");
let username = document.getElementById("username");
let password = document.getElementById("password");

// On page load, retrieve the data from localStorage
window.onload = () => {
  let storedData = localStorage.getItem("passData"); // Correct key for storage
  if (storedData) {
    data = JSON.parse(storedData); // Parse the stored data
    id = data.length ? data[data.length - 1].id + 1 : 0; // Update the id counter based on the stored data
    updateList(); // Display stored entries on page load
  }
};

// Function to display toast messages
let showtoast = (msg,type) => {
  let toastcontainer = document.getElementsByClassName("toast")[0];
  console.log(type,(type=="error"),toastcontainer.children[0].innerHTML)
  toastcontainer.children[0].innerHTML=''
  if(type=="error"){
    toastcontainer.children[0].innerHTML=`<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#e74c3c"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path></svg>`
  }
  else toastcontainer.children[0].innerHTML=`<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#07bc0c"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path></svg>`
  toastcontainer.children[1].innerText = msg;
  toastcontainer.style.top = "10px";
  setTimeout(() => {
    toastcontainer.style.top = "-1000px";
  }, 2000);
};

// Save data to localStorage
let savedata = () => {
  localStorage.setItem("passData", JSON.stringify(data));
};

// Toggle password visibility on icon click
icon.addEventListener("click", () => {
  let password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
    icon.innerHTML =
      '<span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
  } else {
    password.type = "password";
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';
  }
});

// Add new password entry
let addBtn = document.getElementById("submit");
let list = document.getElementsByClassName("password-list")[0];

addBtn.addEventListener("click", () => {
  if (
    url.value.length == 0 ||
    username.value.length == 0 ||
    password.value.length == 0
  ) {
    showtoast("Please fill all the fields","error");
    return;
  }

  // Add new entry to data array
  data.push({
    id,
    url: url.value,
    username: username.value,
    password: password.value,
  });

  showtoast("Added Successfully");
  id++; // Increment id for the next entry

  // Clear input fields
  url.value = "";
  username.value = "";
  password.value = "";

  // Update the displayed list
  updateList();

  // Save updated data to localStorage
  savedata();
});

// Function to update the displayed password list
let updateList = () => {
  // console.log(data.length)
  list.innerHTML=""
  if(data.length===0){
    let li=document.createElement("li")
    li.innerText = `No Saved Passwords`
    list.appendChild(li)
    return
  } 
  list.innerHTML = data
    .map((item) => {
      return `<li key=${item.id} class="password-item">
        <div class="password-info">
            <strong>${item.url}</strong>
            <br>
            Username: ${item.username}
            <br>
            Password: ${"*".repeat(item.password.length)}
        </div>
        <div class="password-actions">
            <button class="edit" >Edit</button>
            <button class="delete" >Delete</button>
            <button class="copy" >Copy</button>
        </div>
      </li>`;
    })
    .join(""); // Join the array of HTML strings into a single string
  Delete();
  Edit();
  Copy();
};

// Delete functionality
const Delete = () => {
  let deleteBtn = document.querySelectorAll(".delete");
  Array.from(deleteBtn).forEach((btn) => {
    btn.addEventListener("click", () => {
      let delid = btn.parentElement.parentElement.getAttribute("key");
      data = data.filter((item) => item.id != delid); // Filter out the deleted item
      showtoast("Deleted Successfully");
      updateList();
      savedata();
    });
  });
};

// Edit functionality
const Edit = () => {
  let editBtn = document.querySelectorAll(".edit");
  Array.from(editBtn).forEach((btn) => {
    btn.addEventListener("click", () => {
      let editid = btn.parentElement.parentElement.getAttribute("key");
      let itemToEdit = data.find((item) => item.id == editid); // Find the item with matching id

      // Populate the fields with the selected item's data
      url.value = itemToEdit.url;
      username.value = itemToEdit.username;
      password.value = itemToEdit.password;

      // Remove the item from the data array temporarily for editing
      data = data.filter((item) => item.id != editid);

      // Update the list and localStorage after removing the old entry
      updateList();
      savedata();
    });
  });
};

const Copy = () => {
  let copyBtn = document.querySelectorAll(".copy")
  Array.from(copyBtn).forEach(btn=>{
    btn.addEventListener("click",()=>{
      let copyid = btn.parentElement.parentElement.getAttribute("key");
      let itemToCopy = data.find((item) => item.id == copyid);
      console.log(itemToCopy);
      navigator.clipboard.writeText(itemToCopy.password);
      showtoast("Copied to clipboard");
    })
  })
};
