 /* --- Gestionnaire de Menu Mobile --- */
document.addEventListener("DOMContentLoaded", () => {
 const navbarToggle = document.getElementById('navbar-toggle');
 const navbarMenu = document.querySelector('.navbar__menu');

 // Fonction pour ouvrir/fermer le menu mobile
 function toggleMenu(event) {
   event.stopPropagation(); // Empêche la propagation de l'événement
   navbarMenu.classList.toggle('show');
   
   // Met à jour l'attribut aria-expanded
   const isShown = navbarMenu.classList.contains('show');
   navbarToggle.setAttribute('aria-expanded', isShown);
 }

 // Fonction pour fermer le menu mobile si on clique en dehors
 function closeMenu(event) {
   if (!navbarMenu.contains(event.target) && event.target !== navbarToggle) {
     navbarMenu.classList.remove('show');
     navbarToggle.setAttribute('aria-expanded', 'false');
   }
 }

 // Fonction pour fermer le menu mobile lorsqu'un lien est cliqué
 function closeMenuOnItemClick() {
   navbarMenu.classList.remove('show');
   navbarToggle.setAttribute('aria-expanded', 'false');
 }

 // Écouteur d'événements pour le bouton Menu
 if (navbarToggle && navbarMenu) {
   navbarToggle.addEventListener('click', toggleMenu);
 }

 // Écouteur d'événements pour fermer le menu en cliquant en dehors
 document.addEventListener('click', closeMenu);

 /* --- Gestionnaire de Clic sur les Liens du Menu Mobile --- */
 const menuLinks = navbarMenu.querySelectorAll('a');

 menuLinks.forEach(link => {
   link.addEventListener('click', closeMenuOnItemClick);
 });

 // Fermer le menu avec la touche Échap (accessibilité)
 function handleEscape(event) {
   if (event.key === 'Escape') {
     navbarMenu.classList.remove('show');
     navbarToggle.setAttribute('aria-expanded', 'false');
   }
 }

 document.addEventListener('keydown', handleEscape);
});








document.addEventListener("DOMContentLoaded", () => {
 
  /* --- 1. HERO SECTION JS --- */

  const heroSection = document.querySelector(".section--hero");
  const heroBlocks = document.querySelectorAll(".hero__block");
  let heroBgTimeout = null;

  // Tableaux d'état pour Hero
  let hoveredTitles = Array(heroBlocks.length).fill(false);
  let descUnlocked = Array(heroBlocks.length).fill(false);
  let hoveredIndex = -1;

  /**
   * Met à jour le flou des TITRES selon l'état de hover et l'historique des hovers
   */
  function updateTitles() {
    heroBlocks.forEach((block, i) => {
      const title = block.querySelector(".hero__title h1");
      if (!title) return;

      // Remove all blur classes
      title.classList.remove("heavy-blur", "light-blur");

      if (hoveredIndex === i) {
        // Titre actuellement survolé : light-blur
        title.classList.add("light-blur");
      } else if (hoveredIndex !== -1) {
        // Un autre titre est survolé : heavy-blur
        title.classList.add("heavy-blur");
      } else if (hoveredTitles[i]) {
        // Aucun titre n'est survolé, mais ce titre a été survolé auparavant : light-blur
        title.classList.add("light-blur");
      } else {
        // Aucun titre n'est survolé et ce titre n'a jamais été survolé : heavy-blur
        title.classList.add("heavy-blur");
      }
    });
  }



  

  /**
   * Met à jour la visibilité des DESCRIPTIONS selon l'index survolé.
   */
  function updateDescriptions() {
    heroBlocks.forEach((block, i) => {
      const description = block.querySelector(".hero__description");
      if (!description) return;

      if (hoveredIndex !== -1) {
        if (i === hoveredIndex) {
          // Bloc survolé : afficher sa description
          description.style.opacity = "1";
          description.style.pointerEvents = "auto";
          descUnlocked[i] = true; // Débloquer la description
        } else {
          // Autres blocs : masquer leur description
          description.style.opacity = "0";
          description.style.pointerEvents = "none";
        }
      } else {
        if (descUnlocked[i]) {
          // Afficher les descriptions débloquées
          description.style.opacity = "1";
          description.style.pointerEvents = "auto";
        } else {
          // Masquer les autres descriptions
          description.style.opacity = "0";
          description.style.pointerEvents = "none";
        }
      }
    });
  }

  /**
   * Gestion des événements de survol sur les blocs Hero
   */
  heroBlocks.forEach((block, index) => {
    const title = block.querySelector(".hero__title h1");

    if (title) {
      // Mettre à jour l'état de hover lors du premier survol du titre
      title.addEventListener("mouseenter", () => {
        if (!hoveredTitles[index]) {
          hoveredTitles[index] = true; // Marquer comme déjà hover
          updateTitles(); // Mettre à jour les titres
        }
      });
    }

    block.addEventListener("mouseenter", () => {
      hoveredIndex = index;

      // Clear any existing background removal timeout
      if (heroBgTimeout) {
        clearTimeout(heroBgTimeout);
        heroBgTimeout = null;
      }

      // Set the background image first
      const image = block.getAttribute("data-image");
      heroSection.style.setProperty("--hero-bg", `url('${image}')`);

      // Définir la position de l'image de fond
      if (index === 0) {
        // Pour le premier bloc, décaler de 500px vers le bas
        heroSection.style.setProperty("--hero-bg-position", "center -500px");
      } else {
        // Pour les autres blocs, position par défaut
        heroSection.style.setProperty("--hero-bg-position", "center");
      }

      // Set opacity to 1 to start transition in
      // Do it after setting the image and position to prevent white screen
      requestAnimationFrame(() => {
        heroSection.style.setProperty("--hero-opacity", "1");
        heroSection.style.setProperty("--hero-filter", "blur(0)");
      });

      // Appliquer la classe pour passer tout en blanc
      document.body.classList.add("hero--hovered");

      // Débloquer la description
      descUnlocked[index] = true;

      // Mettre à jour les titres et descriptions
      updateTitles();
      updateDescriptions();
    });

    block.addEventListener("mouseleave", () => {
      hoveredIndex = -1;

      // Start transition out
      heroSection.style.setProperty("--hero-opacity", "0");
      heroSection.style.setProperty("--hero-filter", "blur(20px)");

      // Set a timeout to remove the background image after the transition
      heroBgTimeout = setTimeout(() => {
        heroSection.style.setProperty("--hero-bg", "none");
        heroSection.style.setProperty("--hero-bg-position", "center"); // Réinitialiser la position
        heroBgTimeout = null;
      }, 2000); // 2 secondes correspondant à la durée de transition

      // Enlever la classe pour revenir aux couleurs originales
      document.body.classList.remove("hero--hovered");

      // Mettre à jour les titres et descriptions
      updateTitles();
      updateDescriptions();
    });
  });

  /**
   * Initialisation : titres en heavy blur, descriptions cachées
   */
  updateTitles();
  updateDescriptions();

  /* --- 2. WORK SECTION JS --- */

  /* Navbar Color Change based on Work section visibility */
  const navbar = document.querySelector(".navbar");
  const workSectionElement = document.querySelector(".section--work");
  const scrollContainer = document.querySelector(".scroll-container");

  const observerOptionsWork = {
    root: scrollContainer, // Observe relative to the scroll container
    rootMargin: "0px",
    threshold: 0.5 // 50% of the section visible triggers the change
  };

  const observerWork = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navbar.classList.add("navbar--dark");
      } else {
        navbar.classList.remove("navbar--dark");
      }
    });
  }, observerOptionsWork);

  if(workSectionElement){
    observerWork.observe(workSectionElement);
  }

  /* Effet de Fading et Changement de Couleur pour la Section Work */
  const workItems = document.querySelectorAll('.work__item');
  const workBackground = document.querySelector('.work__background');
  let workBgTimeout = null; // Pour gérer les timeouts et éviter les glitches

  workItems.forEach((item, index) => {
    const link = item.querySelector('.work__link');
    const desktopImage = item.getAttribute('data-image-desktop');
    const mobileImage = item.getAttribute('data-image-mobile');

    // Détecter le survol
    link.addEventListener('mouseenter', () => {
      // Clear any existing background removal timeout
      if (workBgTimeout) {
        clearTimeout(workBgTimeout);
        workBgTimeout = null;
      }

      // Déterminer l'image à utiliser selon la taille de l'écran
      const isMobile = window.innerWidth <= 768;
      const selectedImage = isMobile ? mobileImage : desktopImage;

      // Changer l'image de fond
      workBackground.style.backgroundImage = `url('${selectedImage}')`;

      // Forcer le recalcul du style pour que la transition fonctionne correctement
      void workBackground.offsetWidth;

      // Démarrer la transition d'opacité
      workBackground.style.opacity = '1';

      // Ajouter la classe 'work-hovered' au body pour changer les couleurs de la navbar et autres éléments
      document.body.classList.add('work-hovered');

      // Ajouter la classe 'blurred' aux autres items
      workItems.forEach(otherItem => {
        if(otherItem !== item){
          otherItem.classList.add('blurred');
        }
      });
    });

    // Détecter la fin du survol
    link.addEventListener('mouseleave', () => {
      // Démarrer la transition de disparition de l'image de fond
      workBackground.style.opacity = '0';

      // Retirer la classe 'work-hovered' du body
      document.body.classList.remove('work-hovered');

      // Retirer la classe 'blurred' des autres items
      workItems.forEach(otherItem => {
        otherItem.classList.remove('blurred');
      });

      // Définir un timeout pour retirer l'image de fond après la transition
      workBgTimeout = setTimeout(() => {
        workBackground.style.backgroundImage = 'none';
        workBgTimeout = null;
      }, 1000); // Durée correspondant à la transition d'opacité (1s)
    });
  });

  /* Gestion Responsive des Images lors du Redimensionnement */
  window.addEventListener('resize', () => {
    // Vérifier si un work item est actuellement survolé
    workItems.forEach(item => {
      const link = item.querySelector('.work__link');
      if (link.matches(':hover')) {
        // Clear any existing background removal timeout
        if (workBgTimeout) {
          clearTimeout(workBgTimeout);
          workBgTimeout = null;
        }

        // Déterminer l'image à utiliser selon la nouvelle taille de l'écran
        const desktopImage = item.getAttribute('data-image-desktop');
        const mobileImage = item.getAttribute('data-image-mobile');
        const isMobile = window.innerWidth <= 768;
        const selectedImage = isMobile ? mobileImage : desktopImage;

        // Mettre à jour l'image de fond
        workBackground.style.backgroundImage = `url('${selectedImage}')`;
      }
    });
  });

  /* Click Event (Navigation vers la page du projet) */
  workItems.forEach(item => {
    const link = item.querySelector('.work__link');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      // Rediriger vers la page du projet
      window.location.href = href;
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  /* --- 1. HERO SECTION JS --- */

  const heroSection = document.querySelector(".section--hero");
  const heroBlocks = document.querySelectorAll(".hero__block");
  let heroBgTimeout = null;

  // Tableaux d'état pour Hero
  let hoveredTitles = Array(heroBlocks.length).fill(false);
  let descUnlocked = Array(heroBlocks.length).fill(false);
  let hoveredIndex = -1;

  /**
   * Met à jour le flou des TITRES selon l'état de hover et l'historique des hovers
   */
  function updateTitles() {
    heroBlocks.forEach((block, i) => {
      const title = block.querySelector(".hero__title h1");
      if (!title) return;

      // Remove all blur classes
      title.classList.remove("heavy-blur", "light-blur");

      if (hoveredIndex === i) {
        // Titre actuellement survolé : light-blur
        title.classList.add("light-blur");
      } else if (hoveredIndex !== -1) {
        // Un autre titre est survolé : heavy-blur
        title.classList.add("heavy-blur");
      } else if (hoveredTitles[i]) {
        // Aucun titre n'est survolé, mais ce titre a été survolé auparavant : light-blur
        title.classList.add("light-blur");
      } else {
        // Aucun titre n'est survolé et ce titre n'a jamais été survolé : heavy-blur
        title.classList.add("heavy-blur");
      }
    });
  }

  /**
   * Met à jour la visibilité des DESCRIPTIONS selon l'index survolé.
   */
  function updateDescriptions() {
    heroBlocks.forEach((block, i) => {
      const description = block.querySelector(".hero__description");
      if (!description) return;

      if (hoveredIndex !== -1) {
        if (i === hoveredIndex) {
          // Bloc survolé : afficher sa description
          description.style.opacity = "1";
          description.style.pointerEvents = "auto";
          descUnlocked[i] = true; // Débloquer la description
        } else {
          // Autres blocs : masquer leur description
          description.style.opacity = "0";
          description.style.pointerEvents = "none";
        }
      } else {
        if (descUnlocked[i]) {
          // Afficher les descriptions débloquées
          description.style.opacity = "1";
          description.style.pointerEvents = "auto";
        } else {
          // Masquer les autres descriptions
          description.style.opacity = "0";
          description.style.pointerEvents = "none";
        }
      }
    });
  }

  /**
   * Gestion des événements de survol sur les blocs Hero
   */
  heroBlocks.forEach((block, index) => {
    const title = block.querySelector(".hero__title h1");

    if (title) {
      // Mettre à jour l'état de hover lors du premier survol du titre
      title.addEventListener("mouseenter", () => {
        if (!hoveredTitles[index]) {
          hoveredTitles[index] = true; // Marquer comme déjà hover
          updateTitles(); // Mettre à jour les titres
        }
      });
    }

    block.addEventListener("mouseenter", () => {
      hoveredIndex = index;

      // Clear any existing background removal timeout
      if (heroBgTimeout) {
        clearTimeout(heroBgTimeout);
        heroBgTimeout = null;
      }

      // Set the background image first
      const image = block.getAttribute("data-image");
      heroSection.style.setProperty("--hero-bg", `url('${image}')`);

      // Définir la position de l'image de fond
      if (index === 0) {
        // Pour le premier bloc, décaler de 500px vers le bas
        heroSection.style.setProperty("--hero-bg-position", "center -500px");
      } else {
        // Pour les autres blocs, position par défaut
        heroSection.style.setProperty("--hero-bg-position", "center");
      }

      // Set opacity to 1 to start transition in
      // Do it after setting the image and position to prevent white screen
      requestAnimationFrame(() => {
        heroSection.style.setProperty("--hero-opacity", "1");
        heroSection.style.setProperty("--hero-filter", "blur(0)");
      });

      // Appliquer la classe pour passer tout en blanc
      document.body.classList.add("hero--hovered");

      // Débloquer la description
      descUnlocked[index] = true;

      // Mettre à jour les titres et descriptions
      updateTitles();
      updateDescriptions();
    });

    block.addEventListener("mouseleave", () => {
      hoveredIndex = -1;

      // Start transition out
      heroSection.style.setProperty("--hero-opacity", "0");
      heroSection.style.setProperty("--hero-filter", "blur(20px)");

      // Set a timeout to remove the background image after the transition
      heroBgTimeout = setTimeout(() => {
        heroSection.style.setProperty("--hero-bg", "none");
        heroSection.style.setProperty("--hero-bg-position", "center"); // Réinitialiser la position
        heroBgTimeout = null;
      }, 2000); // 2 secondes correspondant à la durée de transition

      // Enlever la classe pour revenir aux couleurs originales
      document.body.classList.remove("hero--hovered");

      // Mettre à jour les titres et descriptions
      updateTitles();
      updateDescriptions();
    });
  });

  /**
   * Initialisation : titres en heavy blur, descriptions cachées
   */
  updateTitles();
  updateDescriptions();

  /* --- 2. WORK SECTION JS --- */

  /* Navbar Color Change based on Work section visibility */
  const navbar = document.querySelector(".navbar");
  const workSectionElement = document.querySelector(".section--work");
  const scrollContainer = document.querySelector(".scroll-container");

  const observerOptionsWork = {
    root: scrollContainer, // Observe relative to the scroll container
    rootMargin: "0px",
    threshold: 0.5 // 50% of the section visible triggers the change
  };

  const observerWork = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navbar.classList.add("navbar--dark");
      } else {
        navbar.classList.remove("navbar--dark");
      }
    });
  }, observerOptionsWork);

  if(workSectionElement){
    observerWork.observe(workSectionElement);
  }

  /* Effet de Fading et Changement de Couleur pour la Section Work */
  const workItems = document.querySelectorAll('.work__item');
  const workBackground = document.querySelector('.work__background');
  let workBgTimeout = null; // Pour gérer les timeouts et éviter les glitches

  workItems.forEach((item, index) => {
    const link = item.querySelector('.work__link');
    const desktopImage = item.getAttribute('data-image-desktop');
    const mobileImage = item.getAttribute('data-image-mobile');

    // Détecter le survol
    link.addEventListener('mouseenter', () => {
      // Clear any existing background removal timeout
      if (workBgTimeout) {
        clearTimeout(workBgTimeout);
        workBgTimeout = null;
      }

      // Déterminer l'image à utiliser selon la taille de l'écran
      const isMobile = window.innerWidth <= 768;
      const selectedImage = isMobile ? mobileImage : desktopImage;

      // Changer l'image de fond
      workBackground.style.backgroundImage = `url('${selectedImage}')`;

      // Forcer le recalcul du style pour que la transition fonctionne correctement
      void workBackground.offsetWidth;

      // Démarrer la transition d'opacité
      workBackground.style.opacity = '1';

      // Ajouter la classe 'work-hovered' au body pour changer les couleurs de la navbar et autres éléments
      document.body.classList.add('work-hovered');

      // Ajouter la classe 'blurred' aux autres items
      workItems.forEach(otherItem => {
        if(otherItem !== item){
          otherItem.classList.add('blurred');
        }
      });
    });

    // Détecter la fin du survol
    link.addEventListener('mouseleave', () => {
      // Démarrer la transition de disparition de l'image de fond
      workBackground.style.opacity = '0';

      // Retirer la classe 'work-hovered' du body
      document.body.classList.remove('work-hovered');

      // Retirer la classe 'blurred' des autres items
      workItems.forEach(otherItem => {
        otherItem.classList.remove('blurred');
      });

      // Définir un timeout pour retirer l'image de fond après la transition
      workBgTimeout = setTimeout(() => {
        workBackground.style.backgroundImage = 'none';
        workBgTimeout = null;
      }, 1000); // Durée correspondant à la transition d'opacité (1s)
    });
  });

  /* Gestion Responsive des Images lors du Redimensionnement */
  window.addEventListener('resize', () => {
    // Vérifier si un work item est actuellement survolé
    workItems.forEach(item => {
      const link = item.querySelector('.work__link');
      if (link.matches(':hover')) {
        // Clear any existing background removal timeout
        if (workBgTimeout) {
          clearTimeout(workBgTimeout);
          workBgTimeout = null;
        }

        // Déterminer l'image à utiliser selon la nouvelle taille de l'écran
        const desktopImage = item.getAttribute('data-image-desktop');
        const mobileImage = item.getAttribute('data-image-mobile');
        const isMobile = window.innerWidth <= 768;
        const selectedImage = isMobile ? mobileImage : desktopImage;

        // Mettre à jour l'image de fond
        workBackground.style.backgroundImage = `url('${selectedImage}')`;
      }
    });
  });

  /* Click Event (Navigation vers la page du projet) */
  workItems.forEach(item => {
    const link = item.querySelector('.work__link');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      // Rediriger vers la page du projet
      window.location.href = href;
    });
  });









  document.addEventListener("DOMContentLoaded", () => {
    /* --- 1. HERO SECTION JS --- */
  
    const heroSection = document.querySelector(".section--hero");
    const heroBlocks = document.querySelectorAll(".hero__block");
  
    /**
     * Met à jour le flou des TITRES selon l'état de la section Hero
     */
    function updateTitles() {
      heroBlocks.forEach((block) => {
        const title = block.querySelector(".hero__title h1");
        if (!title) return;
  
        if (heroSection.classList.contains("hero--active")) {
          if (block.classList.contains("active")) {
            // Titre actuellement actif : sans flou
            title.style.filter = "blur(0px)";
            title.style.color = "#000000"; // Texte reste noir
          } else {
            // Autres titres : flou lourd
            title.style.filter = "blur(10px)";
            title.style.color = "#000000"; // Texte reste noir
          }
        } else {
          // Aucun titre actif : tous les titres flous lourd
          title.style.filter = "blur(10px)";
          title.style.color = "#000000"; // Texte reste noir
        }
      });
    }
  
    /**
     * Met à jour la visibilité des DESCRIPTIONS selon l'état de la section Hero
     */
    function updateDescriptions() {
      heroBlocks.forEach((block) => {
        const description = block.querySelector(".hero__description");
        if (!description) return;
  
        if (block.classList.contains("active")) {
          // Bloc actif : afficher la description
          description.style.opacity = "1";
          description.style.pointerEvents = "auto";
          description.style.color = "#000000"; // Texte reste noir
        } else {
          // Bloc inactif : cacher la description
          description.style.opacity = "0";
          description.style.pointerEvents = "none";
          description.style.color = "#000000"; // Texte reste noir
        }
      });
    }
  
    /**
     * Gestion des clics sur les titres pour mobile
     */
    function initHeroMobile() {
      heroBlocks.forEach((block) => {
        const title = block.querySelector(".hero__title h1");
        const description = block.querySelector(".hero__description");
  
        if (title && description) {
          // Handle click to toggle activation
          title.addEventListener("click", (e) => {
            // Vérifier si c'est un appareil mobile
            if (window.innerWidth > 768) return; // Ne pas interférer avec le comportement desktop
  
            e.preventDefault(); // Prevent default click behavior
  
            const isActive = block.classList.contains("active");
  
            if (isActive) {
              // Désactiver le bloc
              block.classList.remove("active");
  
              // Vérifier si aucun autre bloc n'est actif
              let anyActive = false;
              heroBlocks.forEach((blk) => {
                if (blk.classList.contains("active")) {
                  anyActive = true;
                }
              });
  
              if (!anyActive) {
                heroSection.classList.remove("hero--active");
              }
  
              // Réinitialiser les styles
              updateTitles();
              updateDescriptions();
            } else {
              // Activer ce bloc et désactiver les autres
              heroBlocks.forEach((otherBlock) => {
                if (otherBlock !== block) {
                  otherBlock.classList.remove("active");
                }
              });
  
              block.classList.add("active");
              heroSection.classList.add("hero--active");
  
              // Mettre à jour les titres et descriptions
              updateTitles();
              updateDescriptions();
            }
          });
        }
      });
    }
  
    /**
     * Initialisation : définir le comportement selon le type d'appareil
     */
    function initHeroBehavior() {
      if (window.innerWidth > 768) {
        // Initialisation pour Desktop
        initHeroDesktop();
      } else {
        // Initialisation pour Mobile
        initHeroMobile();
      }
    }
  
    // Initialisation au chargement
    initHeroBehavior();
  
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener("resize", () => {
      // Re-initialiser le comportement Hero en fonction de la nouvelle taille de la fenêtre
      initHeroBehavior();
    });
  
    /**
     * Initialisation : titres en heavy blur, descriptions cachées
     */
    updateTitles();
    updateDescriptions();
  
    /**
     * Fonction pour gérer le comportement Desktop (facultatif si vous souhaitez conserver le comportement desktop)
     */
    function initHeroDesktop() {
      // Vous pouvez conserver le comportement desktop si nécessaire
      // Par exemple, gérer les survols avec la souris
      heroBlocks.forEach((block) => {
        const title = block.querySelector(".hero__title h1");
        const description = block.querySelector(".hero__description");
  
        if (title && description) {
          // Handle mouseenter to activate
          block.addEventListener("mouseenter", () => {
            block.classList.add("active");
            heroSection.classList.add("hero--active");
            updateTitles();
            updateDescriptions();
          });
  
          // Handle mouseleave to deactivate
          block.addEventListener("mouseleave", () => {
            block.classList.remove("active");
  
            // Vérifier si aucun autre bloc n'est actif
            let anyActive = false;
            heroBlocks.forEach((blk) => {
              if (blk.classList.contains("active")) {
                anyActive = true;
              }
            });
  
            if (!anyActive) {
              heroSection.classList.remove("hero--active");
            }
  
            updateTitles();
            updateDescriptions();
          });
        }
      });
    }
  });
  
  
  
  
  


















  /* --- 3. AJOUTER LE COMPORTEMENT DU LOGO HERO --- */

  const heroLogoButton = document.getElementById('hero-logo-button');
  const workSection = document.querySelector('.section--work');

  if(heroLogoButton && workSection){
    heroLogoButton.addEventListener('click', () => {
      // Si vous utilisez scrollIntoView et que .scroll-container est l'élément défilant
      workSection.scrollIntoView({ behavior: 'smooth' });

      /* 
         Si scrollIntoView ne fonctionne pas comme prévu à cause de la structure de votre conteneur de défilement,
         utilisez cette alternative pour cibler le scrollContainer directement.

      const scrollContainer = document.querySelector('.scroll-container');
      const workSectionTop = workSection.offsetTop;
      scrollContainer.scrollTo({
        top: workSectionTop,
        behavior: 'smooth'
      });
      */
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  /* --- 1. Définir l'Ordre des Sections --- */
  const sections = [
    document.querySelector('.section--hero'),
    document.querySelector('.section--work'),
    document.querySelector('.section--about')
  ];

  /* --- 2. Utiliser l'IntersectionObserver pour Détecter la Section Actuelle --- */
  let currentSectionIndex = 0;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentSectionIndex = sections.indexOf(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    if (section) {
      observer.observe(section);
    }
  });

  /* --- 3. Mettre à Jour le Gestionnaire d'Événements de Clic sur le Logo --- */
  const heroLogoButton = document.getElementById('hero-logo-button');

  if (heroLogoButton) {
    heroLogoButton.addEventListener('click', () => {
      const nextSectionIndex = currentSectionIndex + 1;

      if (nextSectionIndex < sections.length) {
        const nextSection = sections[nextSectionIndex];
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Optionnel : Revenir à la première section après la dernière
        // const firstSection = sections[0];
        // if (firstSection) {
        //   firstSection.scrollIntoView({ behavior: 'smooth' });
        // }
      }
    });
  }

  /* --- 4. Ajuster la Largeur des Paragraphes de la Section About --- */
  function adjustAboutParagraphWidths() {
    const aboutBlocks = document.querySelectorAll('.about__block');
    
    aboutBlocks.forEach(block => {
      const title = block.querySelector('.about__title');
      const paragraph = block.querySelector('.about__paragraph');
      
      if (title && paragraph) {
        // Obtenir la largeur du titre
        const titleWidth = title.offsetWidth;
        
        // Appliquer cette largeur au paragraphe
        paragraph.style.width = `${titleWidth}px`;
      }
    });
  }

  // Initialiser l'ajustement lors du chargement de la page
  adjustAboutParagraphWidths();

  // Réajuster les largeurs lors du redimensionnement de la fenêtre avec debounce
  function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  window.addEventListener('resize', debounce(adjustAboutParagraphWidths, 200));
});




document.addEventListener("DOMContentLoaded", () => {
  /**
   * Fonction pour ajuster la largeur des paragraphes en fonction de la largeur des titres
   */
  function adjustAboutParagraphWidths() {
    const aboutBlocks = document.querySelectorAll('.about__block');
    
    aboutBlocks.forEach(block => {
      const title = block.querySelector('.about__title');
      const paragraph = block.querySelector('.about__paragraph');
      
      if (title && paragraph) {
        // Obtenir la largeur du titre
        const titleWidth = title.offsetWidth;
        
        // Appliquer cette largeur au paragraphe
        paragraph.style.width = `${titleWidth}px`;
      }
    });
  }

  /**
   * Initialiser l'ajustement lors du chargement de la page
   */
  adjustAboutParagraphWidths();

  /**
   * Réajuster les largeurs lors du redimensionnement de la fenêtre
   */
  window.addEventListener('resize', adjustAboutParagraphWidths);
});



























// Sélectionne toutes les images dans les blocs
document.querySelectorAll('.image-block img').forEach(image => {
  image.addEventListener('click', function () {
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.src = this.src; // Utilise la source de l'image cliquée
    modal.style.display = 'flex'; // Affiche la modale
  });
});

// Ferme la modale en cliquant sur la croix
document.querySelector('.close-modal').addEventListener('click', function () {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none'; // Cache la modale
});

// Ferme la modale en cliquant à l'extérieur de l'image
window.addEventListener('click', function (e) {
  const modal = document.querySelector('.modal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

















