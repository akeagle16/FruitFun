/* Fruit Builder — creation data.
   Each fruit has one creation (v1). Add more by adding entries here.
   badge: "knife"  = kid-safe knife step
          "grownup" = a grown-up does this step
          null     = no cutting                                         */

window.KNIFE_URL = "https://www.walmart.com/ip/1652877759";

window.FRUITS = {
  banana: {
    name: "Banana",
    tint: "#FFF4C7",
    deep: "#8A6A00",
    creation: {
      title: "Banana Dolphin",
      short: "Dolphin",
      level: "Easy",
      video: { label: "Banana dolphin video", url: "https://www.youtube.com/watch?v=1qijns1uojo" },
      done: "You made a dolphin!",
      steps: [
        { title: "Trim the bottom.", hint: "Cut a thin slice off the round end so it can stand.", badge: "knife", count: "1×" },
        { title: "Stand it up.", hint: "Flat end down, curve facing out, stem on top.", badge: null, count: null },
        { title: "Split the stem down the middle.", hint: "That’s the dolphin’s mouth.", badge: "knife", count: "1×" },
        { title: "Cut a little fin.", hint: "Cut a small V in the peel on its back, then fold it up.", badge: "knife", count: "1×" },
        { title: "Poke two eyes.", hint: "Use a toothpick — one dot on each side.", badge: null, count: "2×" },
        { title: "Feed your dolphin.", hint: "Tuck a blueberry or grape into the mouth.", badge: null, count: "1×" }
      ]
    }
  },

  apple: {
    name: "Apple",
    tint: "#FFE3DE",
    deep: "#A3281B",
    creation: {
      title: "Apple Swan",
      short: "Swan",
      level: "Tricky",
      video: { label: "Apple swan video", url: "https://www.youtube.com/watch?v=uLXEiMIiF5E" },
      done: "You made a swan!",
      steps: [
        { title: "Slice off one side.", hint: "Save this piece — it becomes the neck.", badge: "grownup", count: "1×" },
        { title: "Lay it flat.", hint: "Cut side down. This is the swan’s body.", badge: null, count: null },
        { title: "Cut a small wedge.", hint: "Make a little upside-down V on the left side of the top.", badge: "knife", count: "1×" },
        { title: "Cut bigger wedges around it.", hint: "Each V a little bigger than the last. Keep the pieces in order.", badge: "knife", count: "3×" },
        { title: "Do the other side.", hint: "Same wedges on the right side for the second wing.", badge: "knife", count: "3×" },
        { title: "Fan out the wings.", hint: "Slide each wedge back a little so they stack like feathers.", badge: null, count: "2×" },
        { title: "Cut out the neck.", hint: "From the saved piece, cut a curvy S shape with a head.", badge: "grownup", count: "1×" },
        { title: "Cut a notch in front.", hint: "A small slot at the front of the body for the neck.", badge: "knife", count: "1×" },
        { title: "Slide the neck in.", hint: "Push it into the notch so it stands up tall.", badge: null, count: "1×" },
        { title: "Add the eyes.", hint: "Two tiny toothpick dots on the head.", badge: null, count: "2×" }
      ]
    }
  },

  pineapple: {
    name: "Pineapple",
    tint: "#DDF5E9",
    deep: "#1E6B4A",
    creation: {
      title: "Pineapple Butterflies",
      short: "Butterflies",
      level: "Medium",
      video: { label: "Pineapple shapes video", url: "https://www.youtube.com/watch?v=NUgeiJ0Xo64" },
      done: "You made a butterfly!",
      steps: [
        { title: "Cut off the top and bottom.", hint: "Pineapple skin is tough — this one’s for a grown-up.", badge: "grownup", count: "2×" },
        { title: "Slice into rounds.", hint: "About a finger thick. Cut out the hard center circle.", badge: "grownup", count: "3×" },
        { title: "Cut a round in half.", hint: "Straight down the middle.", badge: "knife", count: "1×" },
        { title: "Make the wings.", hint: "Turn the halves so the skin sides touch in the middle.", badge: null, count: "2×" },
        { title: "Cut a thin strip.", hint: "From another piece, cut a skinny strip for the body.", badge: "knife", count: "1×" },
        { title: "Add the body.", hint: "Lay the strip right down the middle.", badge: null, count: "1×" },
        { title: "Give it antennae.", hint: "Two pretzel sticks or thin fruit strips at the top.", badge: null, count: "2×" }
      ]
    }
  }
};
