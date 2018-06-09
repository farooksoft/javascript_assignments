var fs = require('fs');

// 3 CSV files needed for the project
var fileName = ['data/India2011.csv', 'data/IndiaSC2011.csv','data/IndiaST2011.csv'];

// 3 different objects
var age_wise_data = {};
var state_gender_data = {};
var edu_category = {};

var title = [];

/*functional implementation of the project which comprises of 
      1. Age-wise population distribution in terms of literate population
      2. Graduate Population of India - State-wise & Gender-wise.
      3. Education Category wise - all India data combined together
*/
function file_csv(fileN) {

// 3 declerations for array acccess
      var data_age;
      var data_state;
      var edu_data;

// reading the file and making it capable for transactions / operations      
      fs.readFileSync(fileN).toString().split('\n').forEach(function (line_value, index_value) {
          var field = line_value.split(',');
          if (index_value === 0) {
              title = field;
          }
          if(line_value !== '' && index_value !== 0) {

//1. Age-wise population distribution in terms of literate population
          if (field[4] === 'Total' && field[5] !== 'All ages' && field[5] !== '0-6') {
            var literate_population = parseInt(field[12]);
            if (field[5] in age_wise_data)
            {
              data_age = field[5];
              age_wise_data[data_age].total_literate = age_wise_data[data_age].total_literate + literate_population;
            }
            else{
              data_age = field[5];
              age_wise_data[data_age] = {
                age_group: data_age,
                total_literate: literate_population
              };
            }
          }

 //2. Graduate Population of India - State-wise & Gender-wise.         
          if(field[4] === 'Total' && field[5] === 'All ages') {
            var male_population = parseInt(field[40]);
            var female_population = parseInt(field[41]);
            if (field[3] in state_gender_data) {
              data_state = field[3];
              state_gender_data[data_state].population_male = state_gender_data[data_state].population_male + male_population;
              state_gender_data[data_state].population_female = state_gender_data[data_state].population_female + female_population;
            }
            else{
              data_state = field[3].trim().match(/^State\s+-\s+(.*)$/i); 
//regexp is implemented so as to read entire title including white spaces
              data_state = data_state[1];
              state_gender_data[data_state] = {
                state: data_state,
                population_male: male_population,
                population_female: female_population
            };
            }
          }

//3. Education Category wise - all India data combined together
            for(var limit = 15; limit <= 43; limit = limit + 3) {
              var edu_array = title[limit].trim().match(/^Educational level\s+-\s+(.*[^\\*])\s+-\s+\w*$/i);
                edu_data = edu_array[1];
                if(edu_data in edu_category)
                {
                  edu_category[edu_data].total = edu_category[edu_data].total +
                  parseInt(field[limit]);
                }
                else {
                  edu_category[edu_data] = {
                  level_of_edu: edu_data,
                  total: parseInt(field[limit])
                  };
                }
            }
        }
      });
  }


for(var i = 0; i < 3; i = i + 1) {
  var fName = fileName[i];
  file_csv(fName);
  }

fs.writeFile('output/age_wise_data.json', JSON.stringify(age_wise_data));
fs.writeFile('output/state_gender_data.json', JSON.stringify(state_gender_data));
fs.writeFile('output/educational_category.json', JSON.stringify(edu_category));
