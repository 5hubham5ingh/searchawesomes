# [Search Awesomes](https://5hubham5ingh.github.io/searchawesomes/)
![output](https://github.com/user-attachments/assets/e55bd0f8-eead-44d0-8bd6-02703f609e93)


A fuzzy finder to quickly search through the vast collection of "awesome" GitHub repositories, directly in your browser.

## Overview

This project addresses the challenge of navigating the numerous tools and resources listed within "awesome" lists on GitHub.
It fetches README files directly from the GitHub API and caches them in your browser's local storage for fast, offline access. 
Fuzzy searching allows you to efficiently find relevant tools and resources, even with typos or partial keywords.

**Key Features:**

* **Fuzzy Search:** Efficiently find relevant tools and resources, even with typos or partial keywords.
* **GitHub API Integration:** Fetches README files directly from GitHub.
* **Local Storage Caching:** Cache fetched data in your browser for offline access and improved performance.
* **Real-time Results:** Search results are displayed instantly as you type.
* **Bookmark:** Bookmark your favourites for quick access.

## How it Works

1.  **Repository Fetching:** The application fetches the `README.md` files from a predefined list of "awesome" GitHub repositories using the GitHub API.
2.  **Local Storage Caching:** The fetched `README.md` content is then cached in the browser's local storage.
3.  **Parsing:** The `README.md` files are parsed to extract the list of tools and resources.
4.  **Fuzzy Searching:** The application perform fuzzy searches on the parsed data.
5.  **Result Display:** Search results are displayed in real-time, highlighting matching keywords.

## Custom themes
By default, the theme is minimal monochromatic but it can be customised using custom css.


<details>
  <summary> Pastel theme</summary>

```css
:root {
  --background: #f2dbbd;
  --foreground: #99604a;
}

.card{
  border: none !important;

  legend {
    background: inherit;
    border-radius: inherit;
  }
}

#searchResults .card:nth-child(7n+1) {
  background-color: #a8d8ea;
}
#searchResults .card:nth-child(7n+2) {
  background-color: #ffb6b9;
}
#searchResults .card:nth-child(7n+3) {
  background-color: #d4a5a5;
}
#searchResults .card:nth-child(7n+4) {
  background-color: #fbe7c6;
}
#searchResults .card:nth-child(7n+5) {
  background-color: #d5aae6;
}
#searchResults .card:nth-child(7n+6) {
  background-color: #b1e1b1;
}
#searchResults .card:nth-child(7n+7) {
  background-color: #e6c7a7;
}
```
<img width=50% src=https://github.com/user-attachments/assets/2e0015f2-a86d-4ed8-8c22-ace81a666aba /><img width=50% src=https://github.com/user-attachments/assets/98579009-ca2a-472b-b051-11746efcd59f />
<img width=50% src=https://github.com/user-attachments/assets/1f03290f-9412-49a6-a993-b3c224869ed5 /><img width=50% src=https://github.com/user-attachments/assets/2366ae00-3fca-4873-89dc-8f01408f92cc />

</details>
