// Generate a list of metric objects with random values

// Helper function to generate random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Helper function to generate random percentage with 2 decimal places
const randomPercentage = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// Helper function to generate result string in format "percentage-value1-value2"
const generateResult = (min, max) => {
  const value2 = randomNumber(100, 200);
  const value1 = randomNumber(Math.floor(value2 * 0.7), value2);
  const percentage = (value1 / value2 * 100).toFixed(2);
  return `${percentage}-${value1}-${value2}`;
};

// Helper function to determine color based on percentage and trigger/limit
const determineColor = (resultString, trigger, limit) => {
  if (!resultString) return "Grey";
  
  const percentage = parseFloat(resultString.split('-')[0]);
  
  if (percentage >= trigger) return "Green";
  if (percentage >= limit) return "Amber";
  return "Red";
};

// Generate metric objects
const generateMetrics = (count) => {
  const metricPrefixes = ["PM001", "PM002", "PM003", "PM004", "PM005", "PM006", "PM007", "PM008"];
  const metricNames = [
    "PBI Record has Coordinator 24 hours after creation PBI",
    "Incident Resolution within SLA",
    "Change Request Approval Rate",
    "Service Request Completion Time",
    "System Availability Percentage",
    "First Contact Resolution Rate",
    "Customer Satisfaction Score",
    "Backlog Reduction Rate"
  ];
  const sources = ["DataMart.", "ServiceNow.", "PowerBI.", "Tableau.", "JIRA."];
  const valueTypes = ["%", "Days", "Hours", "Count", "Score"];
  
  const metrics = [];
  
  for (let i = 0; i < count; i++) {
    // Generate trigger and limit values
    const trigger = parseFloat(randomPercentage(75, 95));
    const limit = parseFloat(randomPercentage(65, trigger - 2));
    
    // Generate months
    const baseDate = new Date(2025, 2); // March 2025
    const months = [];
    const monthColors = [];
    const monthResults = [];
    
    for (let j = 0; j < 6; j++) {
      const currentDate = new Date(baseDate);
      currentDate.setMonth(baseDate.getMonth() - j);
      
      const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthStr);
      
      // For the last month, sometimes set to null to simulate missing data
      const result = j === 5 && Math.random() > 0.7 ? null : generateResult(60, 100);
      monthResults.push(result);
      
      const color = determineColor(result, trigger, limit);
      monthColors.push(color);
    }
    
    // Create the metric object
    const metric = {
      metricPrefix: metricPrefixes[i % metricPrefixes.length],
      valueType: valueTypes[i % valueTypes.length],
      metricId: i + 1,
      metricName: metricNames[i % metricNames.length],
      serviceAlignment: Math.random() > 0.3 ? "IT Services" : null,
      trigger: trigger,
      limit: limit,
      metricColor: monthColors[0], // Current month color
      source: sources[i % sources.length],
      firstMonth: months[0],
      secondMonth: months[1],
      thirdMonth: months[2],
      fourthMonth: months[3],
      fiveMonth: months[4],
      sixMonth: months[5],
      firstMonth_Result: monthResults[0],
      secondMonth_Result: monthResults[1],
      thirdMonth_Result: monthResults[2],
      fourthMonth_Result: monthResults[3],
      fiveMonth_Result: monthResults[4],
      sixMonth_Result: monthResults[5],
      firstMonth_Color: monthColors[0],
      secondMonth_Color: monthColors[1],
      thirdMonth_Color: monthColors[2],
      fourthMonth_Color: monthColors[3],
      fiveMonth_Color: monthColors[4],
      sixMonth_Color: monthColors[5]
    };
    
    metrics.push(metric);
  }
  
  return metrics;
};

// Generate 5 metric objects
const metricsList = generateMetrics(5);

// Output the result
console.log(JSON.stringify(metricsList, null, 2));
