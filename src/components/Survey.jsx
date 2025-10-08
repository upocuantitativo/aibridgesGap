import React, { useState } from 'react';
import { VARIABLES_DEFINITION } from '../data/variablesDefinition';
import { getDefaultValues } from '../data/variablesDefinition';
import './Survey.css';

const Survey = ({ onLoadToModel, onTabChange }) => {
  const [surveyData, setSurveyData] = useState({});
  const [currentSection, setCurrentSection] = useState('intro');

  const handleInputChange = (questionId, value) => {
    setSurveyData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('surveyData', JSON.stringify(surveyData));
    alert('Survey data saved successfully!');
  };

  const handleLoadToModel = () => {
    // Map survey responses to model variables
    const modelValues = mapSurveyToModel(surveyData);
    onLoadToModel(modelValues);
  };

  const mapSurveyToModel = (survey) => {
    const defaultValues = getDefaultValues();
    const modelValues = { ...defaultValues };

    // Section A1 - Personality (Femininity/Masculinity)
    const femQuestions = ['A1_gentle', 'A1_sympathetic', 'A1_tender', 'A1_warm', 'A1_affectionate', 'A1_sensitive'];
    const masQuestions = ['A1_leader_skills', 'A1_acts_leader', 'A1_dominant', 'A1_strong_personality', 'A1_defends_ideas', 'A1_decides_easily'];

    const femSum = femQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    const masSum = masQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);

    modelValues['A1_1_Personality_Fem'] = femSum > 0 ? femSum / femQuestions.length : 3;
    modelValues['A1_2_Personality_Mas'] = masSum > 0 ? masSum / masQuestions.length : 3;

    // Section A2 - Self-esteem
    const selfEsteemQuestions = ['A2_satisfied', 'A2_worthy', 'A2_good_qualities', 'A2_capable', 'A2_positive_attitude'];
    const selfEsteemSum = selfEsteemQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A2_Selfesteem'] = selfEsteemSum > 0 ? selfEsteemSum / selfEsteemQuestions.length : 3;

    // Section A3 - Self Identity Venture
    const identityQuestions = ['A3_not_fit', 'A3_foreign', 'A3_fits_well'];
    const identitySum = identityQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A3_SelfIdentity_Venture'] = identitySum > 0 ? identitySum / identityQuestions.length : 3;

    // Section A4 - Identity Process
    const processQuestions = ['A4_invent_solutions', 'A4_be_founder', 'A4_grow_business'];
    const processSum = processQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A4_Identity_Proccess'] = processSum > 0 ? processSum / processQuestions.length : 3;

    // Section A5 - Self Efficacy
    const efficacyQuestions = ['A5_define_idea', 'A5_control_process', 'A5_negotiate', 'A5_recognize_opportunities', 'A5_relate_people', 'A5_create_business'];
    const efficacySum = efficacyQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A5_Self_Efficacy'] = efficacySum > 0 ? efficacySum / efficacyQuestions.length : 3;

    // Section A6 - Motivation
    const pullLifestyleQuestions = ['A6_develop_personally', 'A6_lifestyle_flexibility', 'A6_independence'];
    const pullLifestyleSum = pullLifestyleQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A6_2_Mot_Pull_Lifestyle'] = pullLifestyleSum > 0 ? pullLifestyleSum / pullLifestyleQuestions.length : 3;

    const pullOpportunityQuestions = ['A6_economic_opportunity', 'A6_earn_more'];
    const pullOpportunitySum = pullOpportunityQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A6_1_Mot_Pull_Oportunity'] = pullOpportunitySum > 0 ? pullOpportunitySum / pullOpportunityQuestions.length : 3;

    const pushQuestions = ['A6_no_alternative', 'A6_complement_income', 'A6_job_insecurity'];
    const pushSum = pushQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A6_3_Mot_Push'] = pushSum > 0 ? pushSum / pushQuestions.length : 3;

    // Section A7 - Entrepreneurial Intention
    const intentionQuestions = ['A7_probable', 'A7_willing_effort', 'A7_serious_doubts', 'A7_determined', 'A7_professional_goal'];
    const intentionSum = intentionQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A7_Intention_Entrepreneurship'] = intentionSum > 0 ? intentionSum / intentionQuestions.length : 3;

    // Section A8 - Implementation Intention
    const implementationQuestions = ['A8_concrete_steps', 'A8_when_steps', 'A8_where_steps'];
    const implementationSum = implementationQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['A8_Intention_Implementation'] = implementationSum > 0 ? implementationSum / implementationQuestions.length : 3;

    // Section B - Social Capital
    modelValues['B1_Entrepreneurial_Team'] = parseFloat(survey['B1_team']) || 3;

    const structuralQuestions = ['B3_broad_network', 'B3_communicate', 'B3_obtain_resources', 'B3_central_position'];
    const structuralSum = structuralQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['B3_Structural_Social_Capital'] = structuralSum > 0 ? structuralSum / structuralQuestions.length : 3;

    const relationalQuestions = ['B4_trust', 'B4_commitments', 'B4_favors_do', 'B4_favors_receive', 'B4_business_philosophy', 'B4_values', 'B4_vision'];
    const relationalSum = relationalQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['B4_Relational_Social_Capital'] = relationalSum > 0 ? relationalSum / relationalQuestions.length : 3;

    const riskQuestions = ['B5_like_risks', 'B5_risk_free', 'B5_safe_option', 'B5_higher_risks', 'B5_new_experiences'];
    const riskSum = riskQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['B5_Risk_Assumption'] = riskSum > 0 ? riskSum / riskQuestions.length : 3;

    const subjectiveNormsQuestions = ['B6_family', 'B6_friends', 'B6_colleagues'];
    const subjectiveNormsSum = subjectiveNormsQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['B6_Subjective_Norms'] = subjectiveNormsSum > 0 ? subjectiveNormsSum / subjectiveNormsQuestions.length : 3;

    const motivationComplyQuestions = ['B7_family_opinion', 'B7_friends_opinion', 'B7_colleagues_opinion'];
    const motivationComplySum = motivationComplyQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['B7_Motivation_To_Comply'] = motivationComplySum > 0 ? motivationComplySum / motivationComplyQuestions.length : 3;

    // Section C - Skills
    const opportunitiesQuestions = ['C1_identify_goods', 'C1_perceive_needs', 'C1_seek_products'];
    const opportunitiesSum = opportunitiesQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C1_Opportunities'] = opportunitiesSum > 0 ? opportunitiesSum / opportunitiesQuestions.length : 3;

    const persuasionQuestions = ['C2_influence', 'C2_convince', 'C2_persuade'];
    const persuasionSum = persuasionQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C2_Persuasion'] = persuasionSum > 0 ? persuasionSum / persuasionQuestions.length : 3;

    const creativityQuestions = ['C3_novel_ideas', 'C3_ask_help', 'C3_routine_work'];
    const creativitySum = creativityQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C3_Creativity'] = creativitySum > 0 ? creativitySum / creativityQuestions.length : 3;

    const resilienceQuestions = ['C4_recover_fast', 'C4_overcome_difficult', 'C4_take_time'];
    const resilienceSum = resilienceQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C4_Resilience'] = resilienceSum > 0 ? resilienceSum / resilienceQuestions.length : 3;

    const leadershipQuestions = ['C5_direct_people', 'C5_mobilize', 'C5_responsibility'];
    const leadershipSum = leadershipQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C5_Leadership'] = leadershipSum > 0 ? leadershipSum / leadershipQuestions.length : 3;

    const resourcesQuestions = ['C6_adapt_objectives', 'C6_find_resources', 'C6_organize_resources'];
    const resourcesSum = resourcesQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C6_Resources'] = resourcesSum > 0 ? resourcesSum / resourcesQuestions.length : 3;

    const proactivityQuestions = ['C7_solve_problems', 'C7_seek_better_ways', 'C7_overcome_obstacles'];
    const proactivitySum = proactivityQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C7_Proactivity'] = proactivitySum > 0 ? proactivitySum / proactivityQuestions.length : 3;

    const ambitionQuestions = ['C8_growth_attractive', 'C8_large_business_challenge', 'C8_large_business_satisfaction'];
    const ambitionSum = ambitionQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['C8_Ambition'] = ambitionSum > 0 ? ambitionSum / ambitionQuestions.length : 3;

    // Section D - Regional Environment
    const personalResourcesQuestions = ['D1_1_lack_knowledge', 'D1_1_no_business_plan', 'D1_1_lack_experience', 'D1_1_lack_capital', 'D1_1_lack_skills'];
    const personalResourcesSum = personalResourcesQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D1_1_lack_personal_resources'] = personalResourcesSum > 0 ? personalResourcesSum / personalResourcesQuestions.length : 3;

    const personalFearQuestions = ['D1_2_uncertainty', 'D1_2_fear_failure'];
    const personalFearSum = personalFearQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D1_2_personal_fear_failure'] = personalFearSum > 0 ? personalFearSum / personalFearQuestions.length : 3;

    const regionalBarriersQuestions = ['D2_financing', 'D2_qualified_hr', 'D2_facilities', 'D2_support', 'D2_infrastructure', 'D2_mentors', 'D2_supplies'];
    const regionalBarriersSum = regionalBarriersQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D2_Regional_Barriers'] = regionalBarriersSum > 0 ? regionalBarriersSum / regionalBarriersQuestions.length : 3;

    const favourableMarketQuestions = ['D3_little_competition', 'D3_identify_opportunities'];
    const favourableMarketSum = favourableMarketQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D3_1_favourable_market'] = favourableMarketSum > 0 ? favourableMarketSum / favourableMarketQuestions.length : 3;

    const resourcesSupportQuestions = ['D3_financing', 'D3_public_support', 'D3_qualified_consultants', 'D3_few_barriers', 'D3_regulations', 'D3_positive_image'];
    const resourcesSupportSum = resourcesSupportQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D3_2_Resources_Support'] = resourcesSupportSum > 0 ? resourcesSupportSum / resourcesSupportQuestions.length : 3;

    const regionalSupportQuestions = ['D4_start_business', 'D4_manage_business', 'D4_own_business'];
    const regionalSupportSum = regionalSupportQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D4_Regional_Support_0'] = regionalSupportSum > 0 ? regionalSupportSum / regionalSupportQuestions.length : 3;

    const universitySupportQuestions = ['D5_prepare_entrepreneur', 'D5_quality_training'];
    const universitySupportSum = universitySupportQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D5_UniversitySupport'] = universitySupportSum > 0 ? universitySupportSum / universitySupportQuestions.length : 3;

    const cultureQuestions = ['D6_individual_success', 'D6_self_sufficiency', 'D6_risk_taking', 'D6_creativity', 'D6_responsibility'];
    const cultureSum = cultureQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) || 0), 0);
    modelValues['D6_Culture'] = cultureSum > 0 ? cultureSum / cultureQuestions.length : 3;

    // Section E - Role Models
    const roleModelQuestions = ['E7_father', 'E7_mother', 'E7_other_family'];
    const roleModelFamilySum = roleModelQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) === 3 ? 5 : parseFloat(survey[q]) === 2 ? 3 : parseFloat(survey[q]) === 1 ? 1 : 0), 0);
    modelValues['E7_1_Family_Role_model'] = roleModelFamilySum > 0 ? roleModelFamilySum / roleModelQuestions.length : 3;

    const roleModelOtherQuestions = ['E7_friends', 'E7_colleagues'];
    const roleModelOtherSum = roleModelOtherQuestions.reduce((sum, q) => sum + (parseFloat(survey[q]) === 3 ? 5 : parseFloat(survey[q]) === 2 ? 3 : parseFloat(survey[q]) === 1 ? 1 : 0), 0);
    modelValues['E7_2_Other_Role_Model'] = roleModelOtherSum > 0 ? roleModelOtherSum / roleModelOtherQuestions.length : 3;

    // Section G - Experience
    const experienceValue = parseFloat(survey['G2_entrepreneur']) || 0;
    modelValues['G1_Experience'] = experienceValue > 0 ? Math.min(5, experienceValue + 1) : 1;

    return modelValues;
  };

  const renderIntroduction = () => (
    <div className="survey-intro">
      <h2>Presentation</h2>
      <p>
        The objective of this project is to better understand the characteristics of nascent entrepreneurs
        and how they carry out the process of creating a new company.
      </p>
      <p>
        After this section, the questionnaire consists of 4 sections with questions about your perceptions,
        your contact networks, your skills, and your regional environment. The sixth section includes
        questions about your personal data, training and experience.
      </p>
      <button className="start-survey-button" onClick={() => setCurrentSection('A')}>
        Start Survey
      </button>
    </div>
  );

  const renderLikertScale = (questionId, options) => (
    <div className="likert-scale">
      {options.map((option, index) => (
        <label key={index} className="likert-option" title={option}>
          <input
            type="radio"
            name={questionId}
            value={index + 1}
            checked={surveyData[questionId] === (index + 1).toString()}
            onChange={(e) => handleInputChange(questionId, e.target.value)}
          />
          <span className="likert-number">{index + 1}</span>
        </label>
      ))}
      <div className="likert-labels">
        <span className="likert-label-start">{options[0]}</span>
        <span className="likert-label-end">{options[options.length - 1]}</span>
      </div>
    </div>
  );

  const renderSectionA = () => (
    <div className="survey-section">
      <h2>Section A: About Yourself and Your Way of Viewing Things</h2>

      <div className="question-group">
        <h3>A1. Please describe yourself:</h3>
        {[
          { id: 'A1_gentle', label: 'Gentle' },
          { id: 'A1_sympathetic', label: 'Sympathetic' },
          { id: 'A1_leader_skills', label: 'With leadership skills' },
          { id: 'A1_acts_leader', label: 'Acts as a leader' },
          { id: 'A1_dominant', label: 'Dominant' },
          { id: 'A1_tender', label: 'Tender' },
          { id: 'A1_warm', label: 'Warm' },
          { id: 'A1_affectionate', label: 'Affectionate' },
          { id: 'A1_strong_personality', label: 'Strong personality' },
          { id: 'A1_defends_ideas', label: 'Defends own ideas' },
          { id: 'A1_sensitive', label: 'Sensitive to others\' needs' },
          { id: 'A1_decides_easily', label: 'Makes decisions easily' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Never', 'Almost never', 'Sometimes', 'Neutral', 'Often', 'Very often', 'Always'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A2. Regarding your opinion about yourself, do you agree with the following statements?</h3>
        {[
          { id: 'A2_satisfied', label: 'In general, I am satisfied with myself' },
          { id: 'A2_worthy', label: 'I feel that I am a person worthy of appreciation, at least as much as others' },
          { id: 'A2_good_qualities', label: 'I am convinced that I have good qualities' },
          { id: 'A2_capable', label: 'I am capable of doing things as well as most people' },
          { id: 'A2_positive_attitude', label: 'I have a positive attitude toward myself' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A3. The idea of creating a company to commercialize my business idea...</h3>
        {[
          { id: 'A3_not_fit', label: '...Does not fit my own concept' },
          { id: 'A3_foreign', label: '...Is completely foreign to me' },
          { id: 'A3_fits_well', label: '...Fits well with the image I have of myself' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A4. Do you agree that the following activities are an important part of your identity as a person?</h3>
        {[
          { id: 'A4_invent_solutions', label: 'Inventing new solutions to problems' },
          { id: 'A4_be_founder', label: 'Being the founder of a business' },
          { id: 'A4_grow_business', label: 'Growing and developing businesses' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A5. Please indicate to what extent you would be able to effectively perform the following tasks:</h3>
        {[
          { id: 'A5_define_idea', label: 'Define my business idea and the strategy of a new company' },
          { id: 'A5_control_process', label: 'Keep the process of creating a new company under control' },
          { id: 'A5_negotiate', label: 'Negotiate and maintain favorable relationships with potential investors and banks' },
          { id: 'A5_recognize_opportunities', label: 'Recognize opportunities in the market for new products and/or services' },
          { id: 'A5_relate_people', label: 'Relate to key people to obtain capital to create a new company' },
          { id: 'A5_create_business', label: 'Create and put into operation a new company' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Very ineffective', 'Ineffective', 'Moderately effective', 'Effective', 'Very effective'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A6. Do you agree that the following motivations are important for you to become an entrepreneur?</h3>
        {[
          { id: 'A6_develop_personally', label: 'Develop myself personally and professionally' },
          { id: 'A6_economic_opportunity', label: 'Take advantage of an economic opportunity' },
          { id: 'A6_earn_more', label: 'Earn more money than as an employee' },
          { id: 'A6_no_alternative', label: 'Lack of other economic alternative (unemployment)' },
          { id: 'A6_complement_income', label: 'Supplement family income' },
          { id: 'A6_job_insecurity', label: 'Job insecurity and precariousness' },
          { id: 'A6_lifestyle_flexibility', label: 'Lifestyle flexibility' },
          { id: 'A6_independence', label: 'Desire for independence and working for myself' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A7. Indicate your degree of agreement with the following statements:</h3>
        {[
          { id: 'A7_probable', label: 'It is very likely that I will create a company someday' },
          { id: 'A7_willing_effort', label: 'I am willing to make the necessary effort to be an entrepreneur' },
          { id: 'A7_serious_doubts', label: 'I have serious doubts about whether I will ever create a company' },
          { id: 'A7_determined', label: 'I am determined to create a company in the future' },
          { id: 'A7_professional_goal', label: 'My professional goal is to be an entrepreneur' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>A8. Have you thought in detail about the following aspects regarding the creation of your company?</h3>
        {[
          { id: 'A8_concrete_steps', label: 'What concrete steps I need to take to create my company' },
          { id: 'A8_when_steps', label: 'When I will take each of the steps to create my company' },
          { id: 'A8_where_steps', label: 'Where I will carry out each of the steps to create my company' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Not at all', 'Almost nothing', 'Have a vague idea', 'Have an approximate idea', 'Totally planned'])}
          </div>
        ))}
      </div>

      <div className="section-navigation">
        <button onClick={() => setCurrentSection('B')} className="next-section-btn">
          Next Section →
        </button>
      </div>
    </div>
  );

  const renderSectionB = () => (
    <div className="survey-section">
      <h2>Section B: About Your Contact Networks</h2>

      <div className="question-group">
        <h3>B1. For the project you are creating now, do you have a team of partners?</h3>
        <select
          value={surveyData['B1_team'] || ''}
          onChange={(e) => handleInputChange('B1_team', e.target.value)}
        >
          <option value="">Select...</option>
          <option value="1">No, I am alone</option>
          <option value="2">Yes, we are 2</option>
          <option value="3">Yes, we are 3</option>
          <option value="4">Yes, we are 4 or more</option>
          <option value="0">I am not creating any now</option>
        </select>
      </div>

      <div className="question-group">
        <h3>B3. To what extent do you agree with the following statements about your social network (family, friends, acquaintances, work colleagues, other entrepreneurs, clients, etc.)?</h3>
        {[
          { id: 'B3_broad_network', label: 'My social network is very broad and diverse' },
          { id: 'B3_communicate', label: 'I frequently communicate with members of my social network' },
          { id: 'B3_obtain_resources', label: 'I easily obtain information or other resources from my social network' },
          { id: 'B3_central_position', label: 'Generally, I am in an important position within my social network (a central position with many connections to other members)' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>B4. Rate the following questions about the members of your social contact network:</h3>
        {[
          { id: 'B4_trust', label: 'There is a high level of trust among them' },
          { id: 'B4_commitments', label: 'I am sure they keep their commitments to me' },
          { id: 'B4_favors_do', label: 'I usually do favors for them whenever possible' },
          { id: 'B4_favors_receive', label: 'They do favors for me if I ask them' },
          { id: 'B4_business_philosophy', label: 'I share with them a similar philosophy about business' },
          { id: 'B4_values', label: 'I share with them similar values and beliefs' },
          { id: 'B4_vision', label: 'They have a similar vision about the future of our local community' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>B5. Attitude Towards Risk</h3>
        {[
          { id: 'B5_like_risks', label: 'I like taking risks, even if I might fail' },
          { id: 'B5_risk_free', label: 'For me, the best possible plan is one that is risk-free' },
          { id: 'B5_safe_option', label: 'I choose the safest option, even if the rewards are more limited' },
          { id: 'B5_higher_risks', label: 'To obtain greater rewards, I am willing to assume greater risks' },
          { id: 'B5_new_experiences', label: 'I seek new experiences even if their results are risky' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>B6. Regarding the creation of your company, to what extent do the following people approve of this decision?</h3>
        {[
          { id: 'B6_family', label: 'My closest family' },
          { id: 'B6_friends', label: 'My friends' },
          { id: 'B6_colleagues', label: 'My colleagues' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Totally disapprove', 'Disapprove', 'Neither disapprove nor approve', 'Approve', 'Totally approve'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>B7. To what extent do you consider the opinion of the following people important?</h3>
        {[
          { id: 'B7_family_opinion', label: 'The opinion of my family' },
          { id: 'B7_friends_opinion', label: 'The opinion of my friends' },
          { id: 'B7_colleagues_opinion', label: 'The opinion of my colleagues' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Not important', 'Slightly important', 'Neither unimportant nor important', 'Important', 'Very important'])}
          </div>
        ))}
      </div>

      <div className="section-navigation">
        <button onClick={() => setCurrentSection('A')} className="prev-section-btn">
          ← Previous Section
        </button>
        <button onClick={() => setCurrentSection('C')} className="next-section-btn">
          Next Section →
        </button>
      </div>
    </div>
  );

  const renderSectionC = () => (
    <div className="survey-section">
      <h2>Section C: About Your Abilities and Skills</h2>

      <div className="question-group">
        <h3>C1. Opportunity Recognition. Do you agree with the following statements?</h3>
        {[
          { id: 'C1_identify_goods', label: 'I can identify the goods and/or services that customers want' },
          { id: 'C1_perceive_needs', label: 'I perceive the unsatisfied needs of consumers' },
          { id: 'C1_seek_products', label: 'I actively seek products or services that provide a real benefit to customers' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C2. Persuasion. Indicate your degree of agreement with the following statements.</h3>
        {[
          { id: 'C2_influence', label: 'I am able to influence people to do what I want' },
          { id: 'C2_convince', label: 'I am able to convince people to change their minds' },
          { id: 'C2_persuade', label: 'I am able to easily persuade people' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C3. Creativity/Innovation. Do you agree with the following statements?</h3>
        {[
          { id: 'C3_novel_ideas', label: 'People are often surprised by my novel ideas' },
          { id: 'C3_ask_help', label: 'People frequently ask me for help in creative activities' },
          { id: 'C3_routine_work', label: 'I prefer to do routine work rather than creative work' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C4. Resilience. Indicate your degree of agreement with the following statements.</h3>
        {[
          { id: 'C4_recover_fast', label: 'I recover quickly from a stressful event' },
          { id: 'C4_overcome_difficult', label: 'I overcome difficult moments easily' },
          { id: 'C4_take_time', label: 'I usually take quite a while to overcome the setbacks in my life' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C5. Leadership. What is your degree of agreement or disagreement with the following statements?</h3>
        {[
          { id: 'C5_direct_people', label: 'I am able to easily direct people with ideas different from mine' },
          { id: 'C5_mobilize', label: 'I am able to mobilize people to carry out proposed activities' },
          { id: 'C5_responsibility', label: 'I like to assume responsibility for things in the project I am involved in' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C6. Resource Mobilization. Do you agree with the following statements?</h3>
        {[
          { id: 'C6_adapt_objectives', label: 'I easily adapt the objectives to be achieved based on the resources I can have' },
          { id: 'C6_find_resources', label: 'Normally, I can find the necessary resources to develop the initiatives I have' },
          { id: 'C6_organize_resources', label: 'I can organize my resources to complete projects' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C7. Vision/Proactivity. Indicate your degree of agreement or disagreement with the following statements.</h3>
        {[
          { id: 'C7_solve_problems', label: 'If I see something I don\'t like, I fix it' },
          { id: 'C7_seek_better_ways', label: 'I am always looking for better ways to do things' },
          { id: 'C7_overcome_obstacles', label: 'If I believe in an idea, no obstacle will prevent me from making it happen' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>C8. Ambition/Growth Capacity. To what extent do you agree with the following statements?</h3>
        {[
          { id: 'C8_growth_attractive', label: 'The idea that my company grows is very attractive to me' },
          { id: 'C8_large_business_challenge', label: 'Managing a large company would be an exciting challenge' },
          { id: 'C8_large_business_satisfaction', label: 'Having a large company would bring me more satisfactions than disappointments' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="section-navigation">
        <button onClick={() => setCurrentSection('B')} className="prev-section-btn">
          ← Previous Section
        </button>
        <button onClick={() => setCurrentSection('D')} className="next-section-btn">
          Next Section →
        </button>
      </div>
    </div>
  );

  const renderSectionD = () => (
    <div className="survey-section">
      <h2>Section D: About the Characteristics of Your Regional Environment</h2>
      <p className="section-note">Answer the following questions thinking about the characteristics that predominate in the region where you reside.</p>

      <div className="question-group">
        <h3>D1.1. When creating my company, the main personal difficulties I encounter are:</h3>
        {[
          { id: 'D1_1_lack_knowledge', label: 'Lack of necessary knowledge' },
          { id: 'D1_1_no_business_plan', label: 'Not knowing how to write a business plan' },
          { id: 'D1_1_lack_experience', label: 'Lack of experience in the business world' },
          { id: 'D1_1_lack_capital', label: 'Lack of own capital' },
          { id: 'D1_1_lack_skills', label: 'Lack of necessary skills' },
          { id: 'D1_2_uncertainty', label: 'Uncertainty about the future' },
          { id: 'D1_2_fear_failure', label: 'Fear of failure' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>D2. When creating my company, the main difficulties I encounter in my region are:</h3>
        {[
          { id: 'D2_financing', label: 'Difficulty obtaining financing' },
          { id: 'D2_qualified_hr', label: 'Lack of qualified human resources' },
          { id: 'D2_facilities', label: 'Lack of necessary facilities' },
          { id: 'D2_support', label: 'Lack of support (family, administration, cultural aspects)' },
          { id: 'D2_infrastructure', label: 'Lack of necessary infrastructure' },
          { id: 'D2_mentors', label: 'Lack of mentors or advisors' },
          { id: 'D2_supplies', label: 'Lack of specific supplies' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>D3. In my regional environment...</h3>
        {[
          { id: 'D3_little_competition', label: 'A new company usually faces very little competition' },
          { id: 'D3_identify_opportunities', label: 'It is very easy to identify new innovative business opportunities' },
          { id: 'D3_financing', label: 'It is very easy to obtain financing (bank credit, venture capital, etc.)' },
          { id: 'D3_public_support', label: 'There are sufficient public support policies and programs for the creation of new companies' },
          { id: 'D3_qualified_consultants', label: 'There are qualified consultants who support business creation' },
          { id: 'D3_few_barriers', label: 'There are few bureaucratic barriers/obstacles to the creation of new companies' },
          { id: 'D3_regulations', label: 'There are regulations or rules aimed at encouraging the creation of new companies' },
          { id: 'D3_positive_image', label: 'There is a positive image of the entrepreneur' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>D4. In my regional environment, there are favorable conditions for...</h3>
        {[
          { id: 'D4_start_business', label: '...starting a business' },
          { id: 'D4_manage_business', label: '...managing a business' },
          { id: 'D4_own_business', label: '...owning a business' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>D5. The universities and higher education centers in my region...</h3>
        {[
          { id: 'D5_prepare_entrepreneur', label: '...prepare me to be an entrepreneur' },
          { id: 'D5_quality_training', label: '...provide adequate and quality training for business creation' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>D6. In my region, the predominant culture...</h3>
        {[
          { id: 'D6_individual_success', label: '...supports/values individual success obtained through personal effort' },
          { id: 'D6_self_sufficiency', label: '...emphasizes self-sufficiency, autonomy and personal initiative' },
          { id: 'D6_risk_taking', label: '...stimulates the assumption of entrepreneurial risk' },
          { id: 'D6_creativity', label: '...stimulates creativity and innovation' },
          { id: 'D6_responsibility', label: '...emphasizes that the individual is responsible for managing their life' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            {renderLikertScale(q.id, ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'])}
          </div>
        ))}
      </div>

      <div className="section-navigation">
        <button onClick={() => setCurrentSection('C')} className="prev-section-btn">
          ← Previous Section
        </button>
        <button onClick={() => setCurrentSection('E')} className="next-section-btn">
          Next Section →
        </button>
      </div>
    </div>
  );

  const renderSectionE = () => (
    <div className="survey-section">
      <h2>Section E & F & G: Demographic Data and Experience</h2>

      <div className="question-group">
        <h3>E7. Do you personally know any entrepreneur who could serve as a reference for you? And how do you rate their activity as entrepreneurs?</h3>
        {[
          { id: 'E7_father', label: 'Father' },
          { id: 'E7_mother', label: 'Mother' },
          { id: 'E7_other_family', label: 'Other close family member' },
          { id: 'E7_friends', label: 'Friends' },
          { id: 'E7_colleagues', label: 'Colleagues or bosses' }
        ].map(q => (
          <div key={q.id} className="question-item">
            <label>{q.label}</label>
            <select
              value={surveyData[q.id] || ''}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
            >
              <option value="">Select...</option>
              <option value="1">No</option>
              <option value="2">Yes, unfavorable rating</option>
              <option value="3">Yes, favorable rating</option>
            </select>
          </div>
        ))}
      </div>

      <div className="question-group">
        <h3>G2. Do you have previous work experience?</h3>
        <div className="question-item">
          <label>As employee</label>
          <select
            value={surveyData['G2_employee'] || ''}
            onChange={(e) => handleInputChange('G2_employee', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="0">None</option>
            <option value="1">Less than 1 year</option>
            <option value="2">1 to 3 years</option>
            <option value="3">More than 3 years</option>
          </select>
        </div>
        <div className="question-item">
          <label>As self-employed/entrepreneur</label>
          <select
            value={surveyData['G2_entrepreneur'] || ''}
            onChange={(e) => handleInputChange('G2_entrepreneur', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="0">None</option>
            <option value="1">Less than 1 year</option>
            <option value="2">1 to 3 years</option>
            <option value="3">More than 3 years</option>
          </select>
        </div>
      </div>

      <div className="section-navigation">
        <button onClick={() => setCurrentSection('D')} className="prev-section-btn">
          ← Previous Section
        </button>
        <button onClick={() => setCurrentSection('summary')} className="next-section-btn">
          Review & Submit →
        </button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="survey-section">
      <h2>Survey Complete</h2>
      <p>Thank you for completing the survey. You can now save your responses or load them into the prediction model.</p>

      <div className="action-buttons">
        <button className="save-button" onClick={handleSave}>
          💾 Save Survey Data
        </button>
        <button className="load-model-button" onClick={handleLoadToModel}>
          🎯 Load to Prediction Model
        </button>
      </div>

      <div className="section-navigation">
        <button onClick={() => setCurrentSection('E')} className="prev-section-btn">
          ← Previous Section
        </button>
      </div>
    </div>
  );

  return (
    <div className="survey-wrapper">
      {/* Fixed Header with Tabs */}
      <div className="survey-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Predictive Edge of AI in Entrepreneurship</h1>
            <p className="subtitle">Entrepreneurship Survey</p>
            <div className="header-tabs">
              <button className="tab-button" onClick={() => onTabChange && onTabChange('model')}>
                🎯 Model Analysis
              </button>
              <button className="tab-button active">
                📝 Survey
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="survey-container">
        {currentSection === 'intro' && renderIntroduction()}
        {currentSection === 'A' && renderSectionA()}
        {currentSection === 'B' && renderSectionB()}
        {currentSection === 'C' && renderSectionC()}
        {currentSection === 'D' && renderSectionD()}
        {currentSection === 'E' && renderSectionE()}
        {currentSection === 'summary' && renderSummary()}
      </div>
    </div>
  );
};

export default Survey;
