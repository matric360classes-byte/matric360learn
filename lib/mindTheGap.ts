// OFFICIAL DBE MIND THE GAP - FROM YOUR SCREENSHOTS
export const MTG = {
  Mathematics: {
    "Unit 1: Exponents and surds": ["The number system","Working with irrational numbers","Exponents","Exponential equations","Equations with rational exponents","Exam type examples"],
    "Unit 2: Algebra": ["Algebraic expressions","Addition and subtraction","Multiplication and division","Factorising","Notes on factorising a trinomial","Quadratic equations","Quadratic inequalities","Simultaneous equations","The nature of the roots"],
    "Unit 3: Number patterns, sequences and series": ["Number patterns","Arithmetic sequences","Quadratic sequences","Geometric sequences","Arithmetic and geometric series","Sigma notation"],
    "Unit 4: Functions": ["What is a function?","Function notation","The basic functions, formulas and graphs","Inverse functions","The logarithmic function","Transformation of functions"],
    "Unit 5: Trig functions": ["Graphs of trigonometric functions","The effect of a on amplitude","The effect of q on vertical shift","The effect of b on period","The effect of p on horizontal shift"],
    "Unit 6: Finance, growth and decay": ["Simple and compound interest","Calculating P, i and n","Simple and compound decay","Nominal and effective interest rates","Investments with time and interest rate changes","Annuities","Future Value","Present Value"],
    "Unit 7: Calculus": ["Average gradient","Average rate of change","Derivative of a function at a point","Uses of the derivative","Drawing graph of cubic polynomial","First principles","Rules of differentiation","Cubic graphs sketching","Maxima and minima"],
    "Unit 8: Probability": ["Theoretical probability and relative frequency","Venn diagrams","Mutually exclusive events","Complementary events","Events not mutually exclusive","Tree diagrams and contingency tables","Contingency tables","Counting principles","Use of counting principles in probability","Fundamental counting principle","Permutations","Combinations"],
    "Unit 9: Analytical Geometry": ["Revise Analytical Geometry","The equation of a line","The inclination of a line","Circles in analytical geometry","Distance and midpoint formula"],
    "Unit 10: Trigonometry": ["Trig ratios","Trig ratios in all quadrants","Solving triangles with trig","Trig ratios of special angles","Reduction formulae","Trigonometric identities","More trig identities","Solving trigonometric equations","More solving trig equations using identities","Compound and double angle identities","Determining x for which identity is undefined","Co-functions"],
    "Unit 11: Trig - Sine, cosine and area rules": ["Right-angled triangles","Area rule","Sine rule","Cosine rule","Problems in two and three dimensions","2D and 3D Problems"],
    "Unit 12: Euclidean Geometry": ["Proportion and area of triangles","Proportion theorems","Similar polygons","Circle theorems","Cyclic quadrilaterals","Similarity and proportionality","Midpoint Theorem"],
    "Unit 13: Statistics": ["Bar graphs and frequency tables","Measures of central tendency","Measures of dispersion","Five number summary and box and whisker plot","Histograms and frequency polygons","Cumulative frequency and ogives","Variance and standard deviation","Bivariate data and scatter plot","The linear regression line / least squares regression","Regression and least squares","Correlation coefficient","Quartiles"],
  },
  "Physical Sciences": {
    // PHYSICS 10 UNITS - from your screenshots
    "Unit 1: Mechanics - Force and Newtons Laws": ["Revision Vectors","What is force?","Different types of forces","Force diagrams and free body diagrams","Resultant net force","Newtons First Law","Velocity and acceleration Revision","Newtons Second Law acceleration","Newtons Third Law","Newtons Law of Universal Gravitation","Difference between mass and weight"],
    "Unit 2: Momentum and impulse": ["Momentum","Change in momentum","Newtons second law in terms of momentum","Impulse","Principle of conservation of linear momentum","Problem types","Elastic and inelastic collisions"],
    "Unit 3: Vertical projectile motion in 1D": ["Graphs of velocity, acceleration and displacement","Free fall","Graphs Type 1 Dropping a projectile","Graphs Type 2 Projectile shot up then falls","Type 2a Projectile projected up which falls to same level","Type 2b Projectile projected up which falls below original level","Graphs Type 3 Bouncing ball"],
    "Unit 4: Work, energy and power": ["Work","Energy","Power","Work-energy theorem","Conservation of energy"],
    "Unit 5: Doppler Effect": ["Waves Revision","The Doppler Effect","Applications with ultrasound waves","Applications with light","Redshift and blueshift"],
    "Unit 6: Electrostatics": ["Definition Electrical charge & electric force","Law of Conservation of Charge","Coulombs Law","Electric fields around charged objects","Electric field strength"],
    "Unit 7: Electric circuits": ["Factors influencing resistance of a wire","Ohms Law","Voltage and emf","Internal Resistance","Electric energy","Power"],
    "Unit 8: Electrodynamics - Electrical machines": ["Motors and generators","Alternating current circuits","AC and DC"],
    "Unit 9: Optical phenomena and properties of materials": ["Electromagnetic waves and visible light Revision","The photoelectric effect"],
    "Unit 10: Emission and absorption spectra": ["Continuous emission spectra","Atomic emission spectra","Atomic absorption spectra"],
    // CHEMISTRY 6 UNITS - from your screenshots
    "Unit 11: Organic compounds and macromolecules": ["Organic compounds","Physical properties and structure","Physical properties of organic compounds","Factors influencing physical properties","Solids liquids and gases","Chemical properties","Reactions of organic compounds","Reactions of different homologous series","Creating one hydrocarbon from another","Plastics and polymers","Plastics and pollution","IUPAC Naming"],
    "Unit 12: Rate and extent of reactions": ["Energy changes during chemical reactions","Activation energy and activated complex","Catalysts","Energy changes ΔH","Endothermic and exothermic reactions","Rates of reactions","Factors which affect reaction rate","Collision Theory","Mechanism of reactions","Measuring rates of reactions"],
    "Unit 13: Chemical equilibrium": ["Key concepts","Factors that influence equilibrium position","Le Chateliers Principle","Equilibrium Constant Kc","Interpretation of graphs for chemical systems","Applications of equilibrium principles in chemical industry"],
    "Unit 14: Acids and bases": ["Properties of acids and bases","Common acids","Common bases","Mono and polyprotic acids","Conjugate acid-base pairs","Ampholyte","Salt hydrolysis","Acid-base indicators","Acid-base titrations","Preparing a standard solution","Dilution of solutions","Acid-base titration calculations","Equilibrium Constant Ka and Kb","Relationship between Ka and Kb","Auto-ionisation of water","Equilibrium constant for water Kw","The pH scale","pH Calculations"],
    "Unit 15: Electrochemistry": ["Definitions and terminology","Electrochemical cells","Electrolytic cells","Application of electrolysis","Voltaic Galvanic cells","Cell notation","Standard electrode potentials","Standard hydrogen electrode","Emf of an electrochemical cell"],
    "Unit 16: The chlor-alkali industry": ["Definitions and terminology","Chlor-alkali industry reactants and products","Chlor-alkali industry industrial process"],
  }
} as const;

// Helper - finds which official unit a messy DB question belongs to
export function findOfficialUnit(subject: string, q:any): string {
  const subj = subject.includes("Physical") || subject.includes("Physics") || subject.includes("Chemistry")? "Physical Sciences" : "Mathematics";
  const raw = `${q.unit||""} ${q.topic||""} ${q.topic_path||""} ${q.question_text||""}`.toLowerCase();

  const units = MTG[subj as keyof typeof MTG];
  for (const [unitName, topics] of Object.entries(units)) {
    for (const t of topics) {
      const key = t.toLowerCase().split(" ")[0]; // first word match
      if (raw.includes(t.toLowerCase()) || (key.length>4 && raw.includes(key))) {
        return unitName;
      }
    }
  }
  // fallback keyword rules
  if (subj==="Mathematics") {
    if (raw.match(/interest|annuity|decay|depreci/)) return "Unit 6: Finance, growth and decay";
    if (raw.match(/sequence|series|sigma/)) return "Unit 3: Number patterns, sequences and series";
    if (raw.match(/probability|permutation|combination|counting/)) return "Unit 8: Probability";
    if (raw.match(/trig|sine|cosine|area rule/)) return raw.includes("area rule")||raw.includes("sine rule")||raw.includes("cosine rule")||raw.includes("2d and 3d")? "Unit 11: Trig - Sine, cosine and area rules" : "Unit 10: Trigonometry";
    if (raw.match(/calculus|derivative|differentiation|cubic/)) return "Unit 7: Calculus";
    if (raw.match(/analytical|gradient|inclination|distance.*midpoint|circle.*centre/)) return "Unit 9: Analytical Geometry";
    if (raw.match(/euclidean|circle theorem|cyclic|similarity|proportionality|midpoint theorem/)) return "Unit 12: Euclidean Geometry";
    if (raw.match(/statistics|regression|correlation|box and whisker|quartile|ogive|variance|standard deviation/)) return "Unit 13: Statistics";
    if (raw.match(/function|parabola|hyperbola|log.*function|inverse/)) return "Unit 4: Functions";
    if (raw.match(/exponent|surd|irrational/)) return "Unit 1: Exponents and surds";
    return "Unit 2: Algebra";
  }
  return Object.keys(units)[0];
}
