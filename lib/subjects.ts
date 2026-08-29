export const SUBJECTS_DATA:any={
"mathematics":{
name:"Mathematics",
slug:"mathematics",
desc:"CAPS-aligned exam practice",
sections:[
{name:"Mathematics",units:[
{id:"number-patterns",title:"Number Patterns, Sequences and Series",count:5,topics:["Number Patterns","Arithmetic Sequences","Geometric Sequences","Series","Sigma Notation"]},
{id:"functions-inverses",title:"Functions and Inverses",count:5,topics:["Functions Definition","Inverse Functions","Domain and Range","Transformation","Graph Interpretation"]},
{id:"exp-log",title:"Exponential and Logarithmic Functions",count:5,topics:["Exponential Graphs","Logarithms","Log Laws","Equations","Applications"]},
{id:"finance",title:"Finance, Growth and Decay",count:5,topics:["Compound Interest","Depreciation","Annuities","Nominal/Effective","Timelines"]},
{id:"differential-calculus",title:"Differential Calculus",count:5,topics:["First Principles","Rules","Tangents","Curve Sketching","Rate of Change"]},
{id:"calc-apps",title:"Applications of Calculus",count:5,topics:["Max/Min","Optimization","Real World","Interpretation","Exam Type"]},
{id:"analytical-geo",title:"Analytical Geometry",count:4,topics:["Distance","Gradient","Equation of Line","Circles"]},
{id:"trigonometry",title:"Trigonometry",count:5,topics:["Ratios","Quadrants","Identities","Reduction","Special Angles"]},
{id:"trig-apps",title:"Trigonometry Applications",count:5,topics:["Sine Rule","Cosine Rule","Area Rule","2D Problems","3D Problems"]},
{id:"euclidean",title:"Euclidean Geometry",count:5,topics:["Proportion","Similarity","Circle Geometry","Cyclic Quads","Tangents"]},
{id:"statistics",title:"Statistics",count:5,topics:["Box and Whisker","Variance","Regression","Correlation","Ogives"]},
{id:"counting",title:"Counting and Probability",count:5,topics:["Counting Principles","Venn Diagrams","Contingency","Tree Diagrams","Complementary"]},
{id:"distributions",title:"Probability Distributions",count:5,topics:["Binomial","Normal","Expected Value","Variance","Applications"]}
]}
],
curriculum:[{unit:"Mathematics",topics:["Patterns","Functions","Calculus"]}]
},
"physical-sciences":{
name:"Physical Sciences",
slug:"physical-sciences",
desc:"Physics + Chemistry CAPS",
sections:[
{name:"Physics",units:[
{id:"mechanics",title:"Mechanics",count:5,topics:["Newton's First Law","Newton's Second Law","Newton's Third Law","Friction and Inclined Planes","Connected Bodies"]},
{id:"momentum",title:"Momentum and Impulse",count:5,topics:["Momentum","Impulse","Conservation","Elastic Collisions","Inelastic Collisions"]},
{id:"projectile",title:"Vertical Projectile Motion",count:4,topics:["Free Fall","Equations of Motion","Graphs","Bouncing Object"]},
{id:"work-energy",title:"Work, Energy and Power",count:5,topics:["Work Done","Kinetic Energy","Potential Energy","Conservation","Power"]},
{id:"doppler",title:"Doppler Effect",count:4,topics:["Definition","Frequency Shift","Red Shift","Applications"]},
{id:"electrostatics",title:"Electrostatics",count:5,topics:["Coulomb's Law","Electric Field","Charge Quantization","Millikan","Field Patterns"]},
{id:"circuits",title:"Electric Circuits",count:3,topics:["Ohm's Law","Internal Resistance","Series/Parallel"]},
{id:"electrodynamics",title:"Electrodynamics",count:3,topics:["Faraday's Law","Generators","Motors"]},
{id:"optical",title:"Optical Phenomena",count:3,topics:["Photoelectric Effect","Emission","Absorption"]},
{id:"spectra",title:"Emission and Absorption Spectra",count:4,topics:["Line Spectra","Energy Levels","Applications","Bohr Model"]}
]},
{name:"Chemistry",units:[
{id:"organic",title:"Organic Compounds and Macromolecules",count:8,topics:["Nomenclature","Isomers","Functional Groups","Reactions","Polymers","Plastics","Biopolymers","Properties"]},
{id:"rate-extent",title:"Rate and Extent of Reactions",count:4,topics:["Collision Theory","Factors","Maxwell-Boltzmann","Catalysts"]},
{id:"equilibrium",title:"Chemical Equilibrium",count:4,topics:["Le Chatelier","Kc Calculations","Factors","Industrial"]},
{id:"acids-bases",title:"Acids and Bases",count:3,topics:["Definitions","pH Calculations","Titrations"]},
{id:"electrochemistry",title:"Electrochemistry",count:4,topics:["Galvanic Cells","Electrolytic Cells","Standard Potentials","Applications"]},
{id:"chlor-alkali",title:"Chlor-Alkali Industry",count:1,topics:["Membrane Cell"]},
{id:"fertilizers",title:"Fertilizer Industry",count:3,topics:["Haber Process","Ostwald Process","Contact Process"]}
]}
],
curriculum:[{unit:"Physics",topics:["Mechanics","Momentum"]},{unit:"Chemistry",topics:["Organic","Equilibrium"]}]
}
};
export const NODES_TEMPLATE=[
{id:"A",nodeLabel:"Node A · Exam Hook",title:"Exam Hook"},
{id:"B",nodeLabel:"Node B · Learn The Concept",title:"Learn The Concept"},
{id:"C",nodeLabel:"Node C · Worked Example",title:"Worked Example"},
{id:"D",nodeLabel:"Node D · Examiner Traps",title:"Examiner Traps"},
{id:"E",nodeLabel:"Node E · Exam Challenge",title:"Exam Challenge"},
];
