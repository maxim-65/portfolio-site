const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const tiltElements = document.querySelectorAll(".tilt");
const maxTilt = 12;

function handleTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const midX = rect.width / 2;
  const midY = rect.height / 2;
  const rotateY = ((x - midX) / midX) * maxTilt;
  const rotateX = ((midY - y) / midY) * maxTilt;
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt(event) {
  event.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
}

tiltElements.forEach((el) => {
  el.addEventListener("mousemove", handleTilt);
  el.addEventListener("mouseleave", resetTilt);
});

const emailDialog = document.getElementById("emailDialog");
const emailTriggers = document.querySelectorAll(".email-trigger");
const closeButtons = document.querySelectorAll("[data-close]");

emailTriggers.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (emailDialog?.showModal) {
      emailDialog.showModal();
    }
  });
});

closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    emailDialog?.close();
  });
});

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

const particles = [];
const particleCount = 60;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.save();
  ctx.fillStyle = "rgba(124, 92, 255, 0.35)";
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    ctx.globalAlpha = p.opacity;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

function toggleGCPBadges() {
  const container = document.getElementById("gcp-badges");
  const button = document.getElementById("gcp-toggle");
  const hiddenItems = container.querySelectorAll(".badge-hidden");
  const isExpanded = hiddenItems.length === 0;

  if (isExpanded) {
    // Collapse: hide items after index 5
    container.querySelectorAll(".cert-item").forEach((item, index) => {
      if (index > 5) {
        item.classList.add("badge-hidden");
      }
    });
    button.textContent = "Show More (78 More)";
  } else {
    // Expand: show all items
    container.querySelectorAll(".cert-item").forEach((item) => {
      item.classList.remove("badge-hidden");
    });
    button.textContent = "Show Less";
  }
}

// Certificate modal functionality
function initCertificateModal() {
  const certModal = document.getElementById("certModal");
  const certModalClose = document.querySelector(".cert-modal-close");
  const certItems = document.querySelectorAll(".cert-item");
  
  if (!certModal) {
    console.warn("Certificate modal not found");
    return;
  }
  
  // Display certificate metadata (level and type)
  certItems.forEach((item) => {
    const level = item.getAttribute("data-level");
    const type = item.getAttribute("data-type");
    const h4 = item.querySelector("h4");
    
    if ((level || type) && h4 && !item.querySelector(".cert-meta")) {
      const metaDiv = document.createElement("div");
      metaDiv.className = "cert-meta";
      
      if (level) {
        const levelSpan = document.createElement("span");
        levelSpan.className = "cert-badge cert-level";
        levelSpan.textContent = level;
        metaDiv.appendChild(levelSpan);
      }
      
      if (type) {
        const typeSpan = document.createElement("span");
        typeSpan.className = "cert-badge cert-type";
        typeSpan.textContent = type.replace(/-/g, " ");
        metaDiv.appendChild(typeSpan);
      }
      
      h4.after(metaDiv);
    }
  });
  
  // Add click listeners to certificate items
  certItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const title = item.querySelector("h4")?.textContent || "Certificate";
      const link = item.querySelector("a")?.href || "#";
      
      console.log("Opening certificate:", title, link);
      
      // Set modal title and link
      document.getElementById("modalTitle").textContent = title;
      document.getElementById("certOriginalLink").href = link;
      
      // Determine content type and preview
      const previewDiv = document.getElementById("certPreview");
      previewDiv.innerHTML = "";
      
      if (link.endsWith(".pdf")) {
        previewDiv.innerHTML = `<iframe src="${link}"></iframe>`;
      } else if (link.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
        previewDiv.innerHTML = `<img src="${link}" alt="${title}" />`;
      } else {
        previewDiv.innerHTML = `<p>Click 'View Original Certificate' to open the certificate</p>`;
      }
      
      // Show modal
      certModal.showModal();
    });
  });
  
  // Close button listener
  if (certModalClose) {
    certModalClose.addEventListener("click", (e) => {
      e.preventDefault();
      certModal.close();
    });
  }
  
  // Close modal when clicking outside
  certModal.addEventListener("click", (e) => {
    if (e.target === certModal) {
      certModal.close();
    }
  });
  
  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal.open) {
      certModal.close();
    }
  });
}

// Certificate Filter Functionality
function initCertificateFilters() {
  const filterToggle = document.querySelector('.filter-toggle');
  const filterPanel = document.querySelector('.filter-panel');
  const applyButton = document.getElementById('applyFilters');
  const resetButton = document.getElementById('resetFilters');
  const filterInputs = document.querySelectorAll('[data-filter]');
  
  if (!filterToggle || !filterPanel) return;
  
  // Toggle filter panel
  filterToggle.addEventListener('click', () => {
    filterPanel.classList.toggle('active');
    filterToggle.textContent = filterPanel.classList.contains('active') 
      ? 'Hide Filters' 
      : 'Filter Certificates';
  });
  
  // Apply filters
  function applyFilters() {
    const selectedLevels = Array.from(document.querySelectorAll('[data-filter="level"]:checked'))
      .map(input => input.value);
    const selectedTypes = Array.from(document.querySelectorAll('[data-filter="type"]:checked'))
      .map(input => input.value);
    const selectedOrganizations = Array.from(document.querySelectorAll('[data-filter="organization"]:checked'))
      .map(input => input.value);
    const sortBy = document.querySelector('[data-sort]:checked')?.value || 'default';
    
    const allCertItems = Array.from(document.querySelectorAll('.cert-item'));
    const totalCount = allCertItems.length;
    let visibleCount = 0;
    
    // Filter certificates
    allCertItems.forEach(item => {
      const itemLevel = item.getAttribute('data-level');
      const itemType = item.getAttribute('data-type');
      const itemOrganization = item.getAttribute('data-organization');
      
      const levelMatch = !itemLevel || selectedLevels.length === 0 || selectedLevels.includes(itemLevel);
      const typeMatch = !itemType || selectedTypes.length === 0 || selectedTypes.includes(itemType);
      const orgMatch = !itemOrganization || selectedOrganizations.length === 0 || selectedOrganizations.includes(itemOrganization);
      
      if (levelMatch && typeMatch && orgMatch) {
        item.style.display = '';
        item.style.animation = 'fadeIn 0.3s ease';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // Apply sorting within each organization/platform
    if (sortBy !== 'default') {
      document.querySelectorAll('.cert-platform').forEach(platform => {
        const certList = platform.querySelector('.cert-list');
        if (!certList) return;
        
        const items = Array.from(certList.querySelectorAll('.cert-item'));
        
        items.sort((a, b) => {
          if (sortBy === 'alphabetical') {
            const titleA = a.querySelector('h4')?.textContent || '';
            const titleB = b.querySelector('h4')?.textContent || '';
            return titleA.localeCompare(titleB);
          } else if (sortBy === 'level') {
            // Define level order (Advanced to Beginner)
            const levelOrder = { 'advanced': 1, 'intermediate': 2, 'beginner': 3, 'internship': 4 };
            const levelA = levelOrder[a.getAttribute('data-level')] || 999;
            const levelB = levelOrder[b.getAttribute('data-level')] || 999;
            return levelA - levelB;
          }
          return 0;
        });
        
        items.forEach(item => certList.appendChild(item));
      });
    }
    
    // Update platform visibility
    let visiblePlatforms = 0;
    document.querySelectorAll('.cert-platform').forEach(platform => {
      const visibleItems = platform.querySelectorAll('.cert-item:not([style*="display: none"])');
      if (visibleItems.length === 0) {
        platform.style.display = 'none';
      } else {
        platform.style.display = '';
        visiblePlatforms++;
      }
    });
    
    // Update results display
    const resultsDiv = document.getElementById('filterResults');
    if (resultsDiv) {
      const isFiltered = visibleCount < totalCount;
      if (isFiltered) {
        resultsDiv.innerHTML = `
          <div class="filter-results-content">
            <span class="results-count">Showing ${visibleCount} of ${totalCount} certificates</span>
            <span class="results-platforms">${visiblePlatforms} platforms</span>
          </div>
        `;
        resultsDiv.style.display = 'block';
      } else {
        resultsDiv.style.display = 'none';
      }
    }
    
    console.log(`Filtered: ${visibleCount}/${totalCount} certificates visible in ${visiblePlatforms} platforms`);
  }
  
  // Reset filters
  function resetFilters() {
    filterInputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = true;
      }
    });
    // Reset sort to default
    const defaultSort = document.querySelector('[data-sort="default"]');
    if (defaultSort) {
      defaultSort.checked = true;
    }
    applyFilters();
  }
  
  // Event listeners
  if (applyButton) {
    applyButton.addEventListener('click', applyFilters);
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', resetFilters);
  }
  
  // Real-time filtering (optional)
  filterInputs.forEach(input => {
    input.addEventListener('change', applyFilters);
  });
  
  // Sort radio buttons
  const sortButtons = document.querySelectorAll('[data-sort]');
  sortButtons.forEach(button => {
    button.addEventListener('change', applyFilters);
  });
}

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initCertificateModal();
    initCertificateFilters();
  });
} else {
  initCertificateModal();
  initCertificateFilters();
}
