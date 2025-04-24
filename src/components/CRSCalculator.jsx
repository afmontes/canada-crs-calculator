import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Updated April 2025 to reflect removal of arranged employment points
const CRSCalculator = () => {
  const [profiles, setProfiles] = useState(() => {
    // Try to load profiles from localStorage
    const savedProfiles = localStorage.getItem('crsProfiles');
    if (savedProfiles) {
      return JSON.parse(savedProfiles);
    }
    // Default profiles if nothing is saved
    return [
      { name: 'Profile 1', totalScore: 0, scores: {}, inputs: getDefaultInputs() },
      { name: 'Profile 2', totalScore: 0, scores: {}, inputs: getDefaultInputs() },
      { name: 'Profile 3', totalScore: 0, scores: {}, inputs: getDefaultInputs() }
    ];
  });

  function getDefaultInputs() {
    return {
      hasSpouse: false,
      age: 30,
      educationLevel: 'bachelors',
      firstLanguage: {
        speaking: 10,
        listening: 10,
        reading: 10,
        writing: 10
      },
      secondLanguage: {
        speaking: 0,
        listening: 0,
        reading: 0,
        writing: 0
      },
      canadianWorkExperience: 0,
      foreignWorkExperience: 0,
      certificateOfQualification: false,
      spouseEducationLevel: 'none',
      spouseLanguage: {
        speaking: 0,
        listening: 0,
        reading: 0,
        writing: 0
      },
      spouseCanadianWorkExperience: 0,
      hasSiblingInCanada: false,
      frenchLanguage: 'none',
      canadianEducation: 'none',
      provincialNomination: false
    };
  }

  useEffect(() => {
    const newProfiles = [...profiles];
    newProfiles.forEach((profile, index) => {
      const scores = calculateScores(profile.inputs);
      const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0);
      newProfiles[index] = { ...profile, scores, totalScore };
    });
    setProfiles(newProfiles);
    
    // Save to localStorage whenever profiles change
    localStorage.setItem('crsProfiles', JSON.stringify(newProfiles));
  }, [profiles.map(p => JSON.stringify(p.inputs))]);

  const handleInputChange = (profileIndex, category, value) => {
    const newProfiles = [...profiles];
    
    if (typeof value === 'object') {
      newProfiles[profileIndex].inputs = {
        ...newProfiles[profileIndex].inputs,
        [category]: {
          ...newProfiles[profileIndex].inputs[category],
          ...value
        }
      };
    } else {
      newProfiles[profileIndex].inputs = {
        ...newProfiles[profileIndex].inputs,
        [category]: value
      };
    }
    
    setProfiles(newProfiles);
  };

  const calculateScores = (inputs) => {
    const scores = {
      age: calculateAgePoints(inputs.age, inputs.hasSpouse),
      education: calculateEducationPoints(inputs.educationLevel, inputs.hasSpouse),
      firstLanguage: calculateFirstLanguagePoints(inputs.firstLanguage, inputs.hasSpouse),
      secondLanguage: calculateSecondLanguagePoints(inputs.secondLanguage, inputs.hasSpouse),
      canadianWorkExperience: calculateCanadianWorkExperiencePoints(inputs.canadianWorkExperience, inputs.hasSpouse),
      spouseFactors: calculateSpouseFactorsPoints(inputs),
      skillTransferability: calculateSkillTransferabilityPoints(inputs),
      additionalPoints: calculateAdditionalPoints(inputs)
    };
    
    return scores;
  };

  const calculateAgePoints = (age, hasSpouse) => {
    if (age < 18 || age > 44) return 0;
    
    const agePoints = {
      18: hasSpouse ? 90 : 99,
      19: hasSpouse ? 95 : 105,
      20: hasSpouse ? 100 : 110,
      21: hasSpouse ? 100 : 110,
      22: hasSpouse ? 100 : 110,
      23: hasSpouse ? 100 : 110,
      24: hasSpouse ? 100 : 110,
      25: hasSpouse ? 100 : 110,
      26: hasSpouse ? 100 : 110,
      27: hasSpouse ? 100 : 110,
      28: hasSpouse ? 100 : 110,
      29: hasSpouse ? 100 : 110,
      30: hasSpouse ? 95 : 105,
      31: hasSpouse ? 90 : 99,
      32: hasSpouse ? 85 : 94,
      33: hasSpouse ? 80 : 88,
      34: hasSpouse ? 75 : 83,
      35: hasSpouse ? 70 : 77,
      36: hasSpouse ? 65 : 72,
      37: hasSpouse ? 60 : 66,
      38: hasSpouse ? 55 : 61,
      39: hasSpouse ? 50 : 55,
      40: hasSpouse ? 45 : 50,
      41: hasSpouse ? 35 : 39,
      42: hasSpouse ? 25 : 28,
      43: hasSpouse ? 15 : 17,
      44: hasSpouse ? 5 : 6,
    };
    
    return agePoints[age] || 0;
  };

  const calculateEducationPoints = (educationLevel, hasSpouse) => {
    const educationPoints = {
      'none': 0,
      'secondary': hasSpouse ? 28 : 30,
      'oneyear': hasSpouse ? 84 : 90,
      'twoyear': hasSpouse ? 91 : 98,
      'bachelors': hasSpouse ? 112 : 120,
      'twoormore': hasSpouse ? 119 : 128,
      'masters': hasSpouse ? 126 : 135,
      'phd': hasSpouse ? 140 : 150
    };
    
    return educationPoints[educationLevel] || 0;
  };

  const calculateLanguageScore = (ability, hasSpouse, isFirstLanguage) => {
    let points = 0;
    
    if (isFirstLanguage) {
      const firstLangPoints = {
        0: 0, 1: 0, 2: 0, 3: 0, 
        4: hasSpouse ? 6 : 6, 
        5: hasSpouse ? 6 : 6,
        6: hasSpouse ? 8 : 9,
        7: hasSpouse ? 16 : 17,
        8: hasSpouse ? 22 : 23,
        9: hasSpouse ? 29 : 31,
        10: hasSpouse ? 32 : 34
      };
      points = firstLangPoints[ability];
    } else {
      const secondLangPoints = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
        5: hasSpouse ? 1 : 1,
        6: hasSpouse ? 1 : 1,
        7: hasSpouse ? 3 : 3,
        8: hasSpouse ? 3 : 3,
        9: hasSpouse ? 6 : 6,
        10: hasSpouse ? 6 : 6
      };
      points = secondLangPoints[ability];
    }
    
    return points;
  };

  const calculateFirstLanguagePoints = (language, hasSpouse) => {
    const { speaking, listening, reading, writing } = language;
    
    const speakingPoints = calculateLanguageScore(speaking, hasSpouse, true);
    const listeningPoints = calculateLanguageScore(listening, hasSpouse, true);
    const readingPoints = calculateLanguageScore(reading, hasSpouse, true);
    const writingPoints = calculateLanguageScore(writing, hasSpouse, true);
    
    return speakingPoints + listeningPoints + readingPoints + writingPoints;
  };

  const calculateSecondLanguagePoints = (language, hasSpouse) => {
    const { speaking, listening, reading, writing } = language;
    
    const speakingPoints = calculateLanguageScore(speaking, hasSpouse, false);
    const listeningPoints = calculateLanguageScore(listening, hasSpouse, false);
    const readingPoints = calculateLanguageScore(reading, hasSpouse, false);
    const writingPoints = calculateLanguageScore(writing, hasSpouse, false);
    
    // Maximum of 22 points for spouse and 24 points for no spouse
    const maxPoints = hasSpouse ? 22 : 24;
    return Math.min(speakingPoints + listeningPoints + readingPoints + writingPoints, maxPoints);
  };

  const calculateCanadianWorkExperiencePoints = (years, hasSpouse) => {
    const workExpPoints = {
      0: 0,
      1: hasSpouse ? 35 : 40,
      2: hasSpouse ? 46 : 53,
      3: hasSpouse ? 56 : 64,
      4: hasSpouse ? 63 : 72,
      5: hasSpouse ? 70 : 80
    };
    
    return years > 5 ? workExpPoints[5] : (workExpPoints[years] || 0);
  };

  const calculateSpouseFactorsPoints = (inputs) => {
    if (!inputs.hasSpouse) return 0;
    
    const spouseEducationPoints = {
      'none': 0,
      'secondary': 2,
      'oneyear': 6,
      'twoyear': 7,
      'bachelors': 8,
      'twoormore': 9,
      'masters': 10,
      'phd': 10
    };
    
    const educationPoints = spouseEducationPoints[inputs.spouseEducationLevel] || 0;
    
    // Calculate spouse language points
    const { speaking, listening, reading, writing } = inputs.spouseLanguage;
    let languagePoints = 0;
    
    const getLangPoints = (level) => {
      if (level <= 4) return 0;
      if (level <= 6) return 1;
      if (level <= 8) return 3;
      return 5;
    };
    
    languagePoints += getLangPoints(speaking);
    languagePoints += getLangPoints(listening);
    languagePoints += getLangPoints(reading);
    languagePoints += getLangPoints(writing);
    
    // Calculate spouse Canadian work experience points
    const workExpPoints = {
      0: 0,
      1: 5,
      2: 7,
      3: 8,
      4: 9,
      5: 10
    };
    
    const workExperiencePoints = inputs.spouseCanadianWorkExperience > 5 ? 
      workExpPoints[5] : (workExpPoints[inputs.spouseCanadianWorkExperience] || 0);
    
    return educationPoints + languagePoints + workExperiencePoints;
  };

  const calculateSkillTransferabilityPoints = (inputs) => {
    let points = 0;
    
    // A. Education with good official language proficiency (maximum 50 points)
    let educationLanguagePoints = 0;
    
    const educationLevel = {
      'none': 0,
      'secondary': 0,
      'oneyear': 0,
      'twoyear': 0,
      'bachelors': 1,
      'twoormore': 1,
      'masters': 1,
      'phd': 1
    };
    
    const hasHigherEducation = educationLevel[inputs.educationLevel] > 0;
    
    // Calculate CLB level based on first language
    const { speaking, listening, reading, writing } = inputs.firstLanguage;
    const minCLB = Math.min(speaking, listening, reading, writing);
    
    if (hasHigherEducation) {
      if (minCLB >= 9) {
        educationLanguagePoints = 50;
      } else if (minCLB >= 7) {
        educationLanguagePoints = 25;
      }
    }
    
    // B. Education with Canadian work experience (maximum 50 points)
    let educationWorkExpPoints = 0;
    
    if (hasHigherEducation) {
      if (inputs.canadianWorkExperience >= 2) {
        educationWorkExpPoints = 50;
      } else if (inputs.canadianWorkExperience >= 1) {
        educationWorkExpPoints = 25;
      }
    }
    
    // C. Foreign work experience with good official language proficiency (maximum 50 points)
    let foreignExpLanguagePoints = 0;
    
    if (inputs.foreignWorkExperience >= 3) {
      if (minCLB >= 9) {
        foreignExpLanguagePoints = 50;
      } else if (minCLB >= 7) {
        foreignExpLanguagePoints = 25;
      }
    } else if (inputs.foreignWorkExperience >= 1) {
      if (minCLB >= 9) {
        foreignExpLanguagePoints = 25;
      } else if (minCLB >= 7) {
        foreignExpLanguagePoints = 12;
      }
    }
    
    // D. Foreign work experience with Canadian work experience (maximum 50 points)
    let foreignCanadianExpPoints = 0;
    
    if (inputs.foreignWorkExperience >= 3 && inputs.canadianWorkExperience >= 2) {
      foreignCanadianExpPoints = 50;
    } else if (inputs.foreignWorkExperience >= 3 && inputs.canadianWorkExperience >= 1) {
      foreignCanadianExpPoints = 25;
    } else if (inputs.foreignWorkExperience >= 1 && inputs.canadianWorkExperience >= 2) {
      foreignCanadianExpPoints = 25;
    } else if (inputs.foreignWorkExperience >= 1 && inputs.canadianWorkExperience >= 1) {
      foreignCanadianExpPoints = 12;
    }
    
    // E. Certificate of qualification with good official language proficiency (maximum 50 points)
    let certLanguagePoints = 0;
    
    if (inputs.certificateOfQualification) {
      if (minCLB >= 9) {
        certLanguagePoints = 50;
      } else if (minCLB >= 7) {
        certLanguagePoints = 25;
      }
    }
    
    // Calculate total skill transferability points (maximum 100 points)
    const educationPoints = Math.min(educationLanguagePoints + educationWorkExpPoints, 50);
    const foreignExpPoints = Math.min(foreignExpLanguagePoints + foreignCanadianExpPoints, 50);
    
    points = educationPoints + foreignExpPoints + certLanguagePoints;
    return Math.min(points, 100);
  };

  const calculateAdditionalPoints = (inputs) => {
    let points = 0;
    
    // Brother or sister living in Canada (15 points)
    if (inputs.hasSiblingInCanada) {
      points += 15;
    }
    
    // French language skills
    if (inputs.frenchLanguage === 'high-french-low-english') {
      points += 25;
    } else if (inputs.frenchLanguage === 'high-french-high-english') {
      points += 50;
    }
    
    // Post-secondary education in Canada
    if (inputs.canadianEducation === 'one-or-two-years') {
      points += 15;
    } else if (inputs.canadianEducation === 'three-years-or-more') {
      points += 30;
    }
    
    // Provincial nomination (600 points)
    if (inputs.provincialNomination) {
      points += 600;
    }
    
    return points;
  };

  const renderScoreBreakdown = (profile) => {
    return (
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Score Breakdown:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Age:</div>
          <div className="text-right">{profile.scores.age}</div>
          
          <div>Education:</div>
          <div className="text-right">{profile.scores.education}</div>
          
          <div>First Language:</div>
          <div className="text-right">{profile.scores.firstLanguage}</div>
          
          <div>Second Language:</div>
          <div className="text-right">{profile.scores.secondLanguage}</div>
          
          <div>Canadian Work Experience:</div>
          <div className="text-right">{profile.scores.canadianWorkExperience}</div>
          
          <div>Spouse Factors:</div>
          <div className="text-right">{profile.scores.spouseFactors}</div>
          
          <div>Skill Transferability:</div>
          <div className="text-right">{profile.scores.skillTransferability}</div>
          
          <div>Additional Points:</div>
          <div className="text-right">{profile.scores.additionalPoints}</div>
          
          <div className="font-semibold">Total Score:</div>
          <div className="text-right font-semibold">{profile.totalScore}</div>
        </div>
      </div>
    );
  };

  const renderProfileInputs = (profileIndex) => {
    const profile = profiles[profileIndex];
    const inputs = profile.inputs;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Have a spouse/partner?</label>
            <select 
              className="w-full p-2 border rounded"
              value={inputs.hasSpouse ? 'yes' : 'no'}
              onChange={(e) => handleInputChange(profileIndex, 'hasSpouse', e.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Age</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded"
              min="18" 
              max="45" 
              value={inputs.age}
              onChange={(e) => handleInputChange(profileIndex, 'age', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <Tabs defaultValue="core">
          <TabsList className="w-full">
            <TabsTrigger value="core" className="flex-1">Core Factors</TabsTrigger>
            {inputs.hasSpouse && <TabsTrigger value="spouse" className="flex-1">Spouse Factors</TabsTrigger>}
            <TabsTrigger value="skill" className="flex-1">Skill Transferability</TabsTrigger>
            <TabsTrigger value="additional" className="flex-1">Additional Points</TabsTrigger>
          </TabsList>
          
          <TabsContent value="core" className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Level of Education</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.educationLevel}
                onChange={(e) => handleInputChange(profileIndex, 'educationLevel', e.target.value)}
              >
                <option value="none">Less than secondary school</option>
                <option value="secondary">Secondary school</option>
                <option value="oneyear">One-year post-secondary program</option>
                <option value="twoyear">Two-year post-secondary program</option>
                <option value="bachelors">Bachelor's degree</option>
                <option value="twoormore">Two or more post-secondary credentials (one 3+ years)</option>
                <option value="masters">Master's degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">First Official Language (CLB)</label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block mb-1 text-xs">Speaking</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.firstLanguage.speaking}
                    onChange={(e) => handleInputChange(profileIndex, 'firstLanguage', {speaking: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Listening</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.firstLanguage.listening}
                    onChange={(e) => handleInputChange(profileIndex, 'firstLanguage', {listening: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Reading</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.firstLanguage.reading}
                    onChange={(e) => handleInputChange(profileIndex, 'firstLanguage', {reading: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Writing</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.firstLanguage.writing}
                    onChange={(e) => handleInputChange(profileIndex, 'firstLanguage', {writing: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Second Official Language (CLB)</label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block mb-1 text-xs">Speaking</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.secondLanguage.speaking}
                    onChange={(e) => handleInputChange(profileIndex, 'secondLanguage', {speaking: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Listening</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.secondLanguage.listening}
                    onChange={(e) => handleInputChange(profileIndex, 'secondLanguage', {listening: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Reading</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.secondLanguage.reading}
                    onChange={(e) => handleInputChange(profileIndex, 'secondLanguage', {reading: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Writing</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    min="0" 
                    max="10" 
                    value={inputs.secondLanguage.writing}
                    onChange={(e) => handleInputChange(profileIndex, 'secondLanguage', {writing: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Canadian Work Experience (years)</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.canadianWorkExperience}
                onChange={(e) => handleInputChange(profileIndex, 'canadianWorkExperience', parseInt(e.target.value))}
              >
                <option value="0">None or less than a year</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years or more</option>
              </select>
            </div>
          </TabsContent>
          
          {inputs.hasSpouse && (
            <TabsContent value="spouse" className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Spouse's Level of Education</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={inputs.spouseEducationLevel}
                  onChange={(e) => handleInputChange(profileIndex, 'spouseEducationLevel', e.target.value)}
                >
                  <option value="none">Less than secondary school</option>
                  <option value="secondary">Secondary school</option>
                  <option value="oneyear">One-year post-secondary program</option>
                  <option value="twoyear">Two-year post-secondary program</option>
                  <option value="bachelors">Bachelor's degree</option>
                  <option value="twoormore">Two or more post-secondary credentials (one 3+ years)</option>
                  <option value="masters">Master's degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Spouse's First Official Language (CLB)</label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block mb-1 text-xs">Speaking</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      min="0" 
                      max="10" 
                      value={inputs.spouseLanguage.speaking}
                      onChange={(e) => handleInputChange(profileIndex, 'spouseLanguage', {speaking: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs">Listening</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      min="0" 
                      max="10" 
                      value={inputs.spouseLanguage.listening}
                      onChange={(e) => handleInputChange(profileIndex, 'spouseLanguage', {listening: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs">Reading</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      min="0" 
                      max="10" 
                      value={inputs.spouseLanguage.reading}
                      onChange={(e) => handleInputChange(profileIndex, 'spouseLanguage', {reading: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs">Writing</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      min="0" 
                      max="10" 
                      value={inputs.spouseLanguage.writing}
                      onChange={(e) => handleInputChange(profileIndex, 'spouseLanguage', {writing: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Spouse's Canadian Work Experience (years)</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={inputs.spouseCanadianWorkExperience}
                  onChange={(e) => handleInputChange(profileIndex, 'spouseCanadianWorkExperience', parseInt(e.target.value))}
                >
                  <option value="0">None or less than a year</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years or more</option>
                </select>
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="skill" className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Foreign Work Experience (years)</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.foreignWorkExperience}
                onChange={(e) => handleInputChange(profileIndex, 'foreignWorkExperience', parseInt(e.target.value))}
              >
                <option value="0">None</option>
                <option value="1">1-2 years</option>
                <option value="3">3+ years</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Certificate of Qualification (trades)</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.certificateOfQualification ? 'yes' : 'no'}
                onChange={(e) => handleInputChange(profileIndex, 'certificateOfQualification', e.target.value === 'yes')}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Sibling in Canada (citizen/PR)</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.hasSiblingInCanada ? 'yes' : 'no'}
                onChange={(e) => handleInputChange(profileIndex, 'hasSiblingInCanada', e.target.value === 'yes')}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">French Language Skills</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.frenchLanguage}
                onChange={(e) => handleInputChange(profileIndex, 'frenchLanguage', e.target.value)}
              >
                <option value="none">None or basic</option>
                <option value="high-french-low-english">NCLC 7+ (all abilities) and CLB 4 or lower in English</option>
                <option value="high-french-high-english">NCLC 7+ (all abilities) and CLB 5+ (all abilities) in English</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Canadian Education</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.canadianEducation}
                onChange={(e) => handleInputChange(profileIndex, 'canadianEducation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="one-or-two-years">Credential of one or two years</option>
                <option value="three-years-or-more">Credential three years or longer</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Arranged Employment</label>
              <div className="w-full p-2 border rounded bg-gray-100 text-gray-500">
                As of March 25, 2025, IRCC has removed CRS points for arranged employment
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Provincial Nomination</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputs.provincialNomination ? 'yes' : 'no'}
                onChange={(e) => handleInputChange(profileIndex, 'provincialNomination', e.target.value === 'yes')}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
        
        {renderScoreBreakdown(profile)}
      </div>
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add title and date
    doc.setFontSize(18);
    doc.text('Canada CRS Calculator Results', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${currentDate}`, 14, 30);
    
    // Create table data for scores
    const tableColumn = ['Category', ...profiles.map(p => p.name)];
    const tableRows = [
      ['Age', ...profiles.map(p => p.scores.age)],
      ['Education', ...profiles.map(p => p.scores.education)],
      ['First Language', ...profiles.map(p => p.scores.firstLanguage)],
      ['Second Language', ...profiles.map(p => p.scores.secondLanguage)],
      ['Canadian Work Experience', ...profiles.map(p => p.scores.canadianWorkExperience)],
      ['Spouse Factors', ...profiles.map(p => p.scores.spouseFactors)],
      ['Skill Transferability', ...profiles.map(p => p.scores.skillTransferability)],
      ['Additional Points', ...profiles.map(p => p.scores.additionalPoints)],
      ['Total Score', ...profiles.map(p => p.totalScore)],
    ];
    
    // Add scores table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [66, 139, 202] },
    });
    
    // Add interpretation guide
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Interpretation Guide for 2025:', 14, finalY);
    doc.setFontSize(10);
    doc.text('• 600+ points: Very high chance of invitation in most draws', 20, finalY + 10);
    doc.text('• 520-600 points: Good chance in general draws', 20, finalY + 16);
    doc.text('• 470-520 points: Moderate chance in CEC-specific draws', 20, finalY + 22);
    doc.text('• 410-470 points: Possible in category-based or program-specific draws', 20, finalY + 28);
    doc.text('• Below 410 points: Consider Provincial Nominee Program (PNP) or alternative pathways', 20, finalY + 34);
    
    doc.setFontSize(9);
    doc.text('Note: With the removal of arranged employment points in March 2025, CRS scores have generally decreased.', 14, finalY + 44);
    
    // Add profile details
    profiles.forEach((profile, index) => {
      if (index > 0) doc.addPage();
      const startY = index > 0 ? 20 : finalY + 55;
      
      doc.setFontSize(14);
      doc.text(`${profile.name} Details:`, 14, startY);
      
      const inputs = profile.inputs;
      const detailsData = [
        ['Age', inputs.age],
        ['Has Spouse', inputs.hasSpouse ? 'Yes' : 'No'],
        ['Education Level', inputs.educationLevel],
        ['First Language (IELTS/TEF)', `S:${inputs.firstLanguage.speaking}, L:${inputs.firstLanguage.listening}, R:${inputs.firstLanguage.reading}, W:${inputs.firstLanguage.writing}`],
        ['Canadian Work Experience', `${inputs.canadianWorkExperience} years`],
        ['Foreign Work Experience', `${inputs.foreignWorkExperience} years`],
        ['Certificate of Qualification', inputs.certificateOfQualification ? 'Yes' : 'No'],
        ['Has Sibling in Canada', inputs.hasSiblingInCanada ? 'Yes' : 'No'],
        ['French Language Proficiency', inputs.frenchLanguage],
        ['Canadian Education', inputs.canadianEducation],
        ['Provincial Nomination', inputs.provincialNomination ? 'Yes' : 'No']
      ];
      
      if (inputs.hasSpouse) {
        detailsData.push(
          ['Spouse Education Level', inputs.spouseEducationLevel],
          ['Spouse Language', `S:${inputs.spouseLanguage.speaking}, L:${inputs.spouseLanguage.listening}, R:${inputs.spouseLanguage.reading}, W:${inputs.spouseLanguage.writing}`],
          ['Spouse Canadian Work Experience', `${inputs.spouseCanadianWorkExperience} years`]
        );
      }
      
      doc.autoTable({
        body: detailsData,
        startY: startY + 10,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 80 } }
      });
    });
    
    // Save the PDF
    doc.save('CRS_Calculator_Results.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Canada CRS Calculator (2025)</CardTitle>
          <p className="text-center text-gray-600">Calculate your Comprehensive Ranking System score for Express Entry</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile0">
            <TabsList className="grid grid-cols-3 mb-4">
              {profiles.map((profile, index) => (
                <TabsTrigger key={index} value={`profile${index}`}>{profile.name}</TabsTrigger>
              ))}
            </TabsList>
            
            {profiles.map((profile, index) => (
              <TabsContent key={index} value={`profile${index}`}>
                {renderProfileInputs(index)}
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Score Comparison</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Factor</th>
                  {profiles.map((profile, index) => (
                    <th key={index} className="border p-2 text-center">{profile.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Age</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.age}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Education</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.education}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">First Language</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.firstLanguage}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Second Language</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.secondLanguage}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Canadian Work Experience</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.canadianWorkExperience}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Spouse Factors</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.spouseFactors}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Skill Transferability</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.skillTransferability}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2">Additional Points</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.scores.additionalPoints}</td>
                  ))}
                </tr>
                <tr className="font-bold">
                  <td className="border p-2">Total Score</td>
                  {profiles.map((profile, index) => (
                    <td key={index} className="border p-2 text-center">{profile.totalScore}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <button 
              onClick={exportToPDF} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Export to PDF
            </button>
            
            <button 
              onClick={() => {
                localStorage.removeItem('crsProfiles');
                setProfiles([
                  { name: 'Profile 1', totalScore: 0, scores: {}, inputs: getDefaultInputs() },
                  { name: 'Profile 2', totalScore: 0, scores: {}, inputs: getDefaultInputs() },
                  { name: 'Profile 3', totalScore: 0, scores: {}, inputs: getDefaultInputs() }
                ]);
              }} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset All Data
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Interpretation Guide for 2025:</h3>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li><span className="font-medium">600+ points</span>: Very high chance of invitation in most draws (typically PNP candidates)</li>
              <li><span className="font-medium">520-600 points</span>: Good chance in general draws (based on 2025 trends)</li>
              <li><span className="font-medium">470-520 points</span>: Moderate chance in CEC-specific draws</li>
              <li><span className="font-medium">410-470 points</span>: Possible in category-based or program-specific draws</li>
              <li><span className="font-medium">Below 410 points</span>: Consider Provincial Nominee Program (PNP) or alternative pathways</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">Note: With the removal of arranged employment points in March 2025, CRS scores have generally decreased across the Express Entry pool.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRSCalculator;