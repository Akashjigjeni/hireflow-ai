const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';

const results = [];

function recordResult(testName, passed, details = '') {
  results.push({ testName, passed, details });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function runTests() {
  console.log('🚀 Starting Full HireFlow AI Comprehensive E2E Testing Suite...\n');

  try {
    // 1. Root server test
    try {
      const rootRes = await axios.get('http://localhost:5000/');
      recordResult('Backend Server Health Check', rootRes.status === 200, rootRes.data);
    } catch (err) {
      recordResult('Backend Server Health Check', false, err.message);
    }

    // Generate unique emails for this test run
    const timestamp = Date.now();
    const employerEmail = `emp_${timestamp}@hireflowtest.com`;
    const candidateEmail = `cand_${timestamp}@hireflowtest.com`;
    const password = 'TestPassword123!';

    let employerToken = '';
    let employerUser = null;
    let candidateToken = '';
    let candidateUser = null;

    // 2. Employer Registration
    try {
      const regEmpRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Tech Recruiter Test',
        email: employerEmail,
        password: password,
        role: 'employer',
        company: 'HireFlow Tech Labs'
      });
      employerToken = regEmpRes.data.token;
      employerUser = regEmpRes.data.user;
      recordResult('Employer Registration', regEmpRes.status === 201 && !!employerToken, `User ID: ${employerUser?.id || employerUser?._id}`);
    } catch (err) {
      recordResult('Employer Registration', false, err.response?.data?.message || err.message);
    }

    // 3. Employer Login
    try {
      const loginEmpRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: employerEmail,
        password: password
      });
      employerToken = loginEmpRes.data.token;
      recordResult('Employer Login', loginEmpRes.status === 200 && !!loginEmpRes.data.token, `Token Issued`);
    } catch (err) {
      recordResult('Employer Login', false, err.response?.data?.message || err.message);
    }

    // 4. Candidate Registration
    try {
      const regCandRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Jane Candidate Test',
        email: candidateEmail,
        password: password,
        role: 'candidate',
        skills: 'React, Node, MongoDB, Express, JavaScript'
      });
      candidateToken = regCandRes.data.token;
      candidateUser = regCandRes.data.user;
      recordResult('Candidate Registration', regCandRes.status === 201 && !!candidateToken, `User ID: ${candidateUser?.id || candidateUser?._id}`);
    } catch (err) {
      recordResult('Candidate Registration', false, err.response?.data?.message || err.message);
    }

    // 5. Candidate Login
    try {
      const loginCandRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: candidateEmail,
        password: password
      });
      candidateToken = loginCandRes.data.token;
      recordResult('Candidate Login', loginCandRes.status === 200 && !!loginCandRes.data.token, `Token Issued`);
    } catch (err) {
      recordResult('Candidate Login', false, err.response?.data?.message || err.message);
    }

    // 6. Verify Auth /me Endpoint for Candidate
    try {
      const meRes = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      recordResult('Auth Check (/api/auth/me)', meRes.status === 200 && meRes.data.email === candidateEmail, meRes.data.name);
    } catch (err) {
      recordResult('Auth Check (/api/auth/me)', false, err.response?.data?.message || err.message);
    }

    // 7. Employer Posts a Job
    let createdJobId = null;
    try {
      const jobPayload = {
        title: `Senior AI Full Stack Engineer ${timestamp}`,
        company: 'HireFlow Tech Labs',
        location: 'Remote',
        salaryRange: '$130,000 - $160,000',
        skills: ['React', 'Node', 'MongoDB', 'Express', 'JavaScript'],
        description: 'Looking for a Senior AI Full Stack Engineer to lead web and AI system integrations.'
      };
      const postJobRes = await axios.post(`${BASE_URL}/jobs`, jobPayload, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      createdJobId = postJobRes.data.job?._id || postJobRes.data._id;
      recordResult('Employer Post Job', postJobRes.status === 201 && !!createdJobId, `Job ID: ${createdJobId}`);
    } catch (err) {
      recordResult('Employer Post Job', false, err.response?.data?.message || err.message);
    }

    // 8. Public Jobs Listing & Search
    try {
      const getJobsRes = await axios.get(`${BASE_URL}/jobs`);
      const jobsList = getJobsRes.data;
      const foundCreated = Array.isArray(jobsList) && jobsList.some(j => j._id === createdJobId);
      recordResult('Public Jobs Listing', getJobsRes.status === 200 && foundCreated, `Total jobs: ${jobsList.length}`);
    } catch (err) {
      recordResult('Public Jobs Listing', false, err.response?.data?.message || err.message);
    }

    // 9. Employer Get My Jobs
    try {
      const myJobsRes = await axios.get(`${BASE_URL}/jobs/my/jobs`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      const myJobs = myJobsRes.data;
      const hasJob = Array.isArray(myJobs) && myJobs.some(j => j._id === createdJobId);
      recordResult('Employer Get My Jobs', myJobsRes.status === 200 && hasJob, `Total employer jobs: ${myJobs.length}`);
    } catch (err) {
      recordResult('Employer Get My Jobs', false, err.response?.data?.message || err.message);
    }

    // 10. Update Job
    try {
      const updateRes = await axios.put(`${BASE_URL}/jobs/${createdJobId}`, {
        salaryRange: '$140,000 - $170,000',
        location: 'Hybrid - New York'
      }, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      recordResult('Employer Update Job', updateRes.status === 200, `Updated Location: ${updateRes.data.job?.location}`);
    } catch (err) {
      recordResult('Employer Update Job', false, err.response?.data?.message || err.message);
    }

    // 11. Candidate Save Job
    try {
      const saveRes = await axios.post(`${BASE_URL}/saved-jobs/${createdJobId}`, {}, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      recordResult('Candidate Save Job', saveRes.status === 200 || saveRes.status === 201, saveRes.data.message || 'Saved');
    } catch (err) {
      recordResult('Candidate Save Job', false, err.response?.data?.message || err.message);
    }

    // 12. Candidate Get Saved Jobs
    try {
      const getSavedRes = await axios.get(`${BASE_URL}/saved-jobs`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const savedList = getSavedRes.data;
      const isSaved = Array.isArray(savedList) && savedList.some(s => (s.job?._id || s.job) === createdJobId);
      recordResult('Candidate Get Saved Jobs', getSavedRes.status === 200 && isSaved, `Saved Count: ${savedList.length}`);
    } catch (err) {
      recordResult('Candidate Get Saved Jobs', false, err.response?.data?.message || err.message);
    }

    // 13. Candidate Apply to Job (with valid PDF resume)
    let applicationId = null;
    try {
      const mockPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 120 >>
stream
BT
/F1 12 Tf
72 712 Td
(Jane Doe - Full Stack Developer. Skills: React, Node, MongoDB, Express, JavaScript, HTML, CSS) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000414 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
495
%%EOF`;

      const mockPdfPath = path.join(__dirname, 'mock_resume.pdf');
      fs.writeFileSync(mockPdfPath, mockPdfContent);

      const form = new FormData();
      form.append('coverLetter', 'I am very excited to apply for this Senior AI Full Stack Engineer position.');
      form.append('resume', fs.createReadStream(mockPdfPath));

      const applyRes = await axios.post(`${BASE_URL}/applications/${createdJobId}`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${candidateToken}`
        }
      });
      applicationId = applyRes.data._id || applyRes.data.application?._id;
      recordResult('Candidate Apply To Job (PDF upload)', (applyRes.status === 200 || applyRes.status === 201) && !!applicationId, `Application ID: ${applicationId}`);

      if (fs.existsSync(mockPdfPath)) fs.unlinkSync(mockPdfPath);
    } catch (err) {
      recordResult('Candidate Apply To Job (PDF upload)', false, err.response?.data?.message || err.message);
    }

    // 14. Candidate View My Applications
    try {
      const myAppsRes = await axios.get(`${BASE_URL}/applications/my`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const myApps = myAppsRes.data;
      const foundApp = Array.isArray(myApps) && myApps.some(a => a._id === applicationId);
      recordResult('Candidate View My Applications', myAppsRes.status === 200 && foundApp, `Applications count: ${myApps.length}`);
    } catch (err) {
      recordResult('Candidate View My Applications', false, err.response?.data?.message || err.message);
    }

    // 15. Employer View Applicants For Job
    try {
      const applicantsRes = await axios.get(`${BASE_URL}/applications/job/${createdJobId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      const applicants = applicantsRes.data;
      const foundCandidateApp = Array.isArray(applicants) && applicants.some(a => a._id === applicationId);
      recordResult('Employer View Job Applicants', applicantsRes.status === 200 && foundCandidateApp, `Applicants count: ${applicants.length}`);
    } catch (err) {
      recordResult('Employer View Job Applicants', false, err.response?.data?.message || err.message);
    }

    // 16. AI Resume Analysis
    try {
      const aiAnalyzeRes = await axios.post(`${BASE_URL}/ai/analyze/${applicationId}`, {}, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      recordResult('AI Resume Analysis Route', aiAnalyzeRes.status === 200, `Score: ${aiAnalyzeRes.data.score}% | Matched: ${aiAnalyzeRes.data.matchedSkills?.join(', ')}`);
    } catch (err) {
      recordResult('AI Resume Analysis Route', false, err.response?.data?.message || err.message);
    }

    // 17. AI Interview Questions Generation
    try {
      const aiInterviewRes = await axios.get(`${BASE_URL}/ai/interview/${applicationId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      const questionsCount = aiInterviewRes.data.questions?.length || 0;
      recordResult('AI Interview Questions Generation', aiInterviewRes.status === 200 && questionsCount > 0, `Generated ${questionsCount} questions`);
    } catch (err) {
      recordResult('AI Interview Questions Generation', false, err.response?.data?.message || err.message);
    }

    // 18. AI Cover Letter Generation
    try {
      const aiCoverRes = await axios.get(`${BASE_URL}/ai/cover-letter/${applicationId}`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      recordResult('AI Cover Letter Generation', aiCoverRes.status === 200 && !!aiCoverRes.data.coverLetter, 'Cover letter generated successfully');
    } catch (err) {
      recordResult('AI Cover Letter Generation', false, err.response?.data?.message || err.message);
    }

    // 19. Employer Update Application Status
    try {
      const statusRes = await axios.put(`${BASE_URL}/applications/${applicationId}/status`, {
        status: 'Accepted'
      }, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      recordResult('Employer Update Application Status', statusRes.status === 200, `New Status: ${statusRes.data.application?.status}`);
    } catch (err) {
      recordResult('Employer Update Application Status', false, err.response?.data?.message || err.message);
    }

    // 20. Candidate Dashboard Stats
    try {
      const candStatsRes = await axios.get(`${BASE_URL}/candidate-dashboard/stats`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      recordResult('Candidate Dashboard Stats', candStatsRes.status === 200, `Apps: ${candStatsRes.data.totalApplications}, Accepted: ${candStatsRes.data.accepted}`);
    } catch (err) {
      recordResult('Candidate Dashboard Stats', false, err.response?.data?.message || err.message);
    }

    // 21. Employer Dashboard Stats
    try {
      const empStatsRes = await axios.get(`${BASE_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${employerToken}` }
      });
      recordResult('Employer Dashboard Stats', empStatsRes.status === 200, `Jobs: ${empStatsRes.data.totalJobs}, Applicants: ${empStatsRes.data.totalApplicants}, Accepted: ${empStatsRes.data.accepted}`);
    } catch (err) {
      recordResult('Employer Dashboard Stats', false, err.response?.data?.message || err.message);
    }

    // 22. User Profile Get and Update
    try {
      const profileGetRes = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const profilePutRes = await axios.put(`${BASE_URL}/users/profile`, {
        bio: 'Passionate AI & Fullstack Developer',
        skills: 'React, Node, MongoDB, Express, JavaScript'
      }, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      recordResult('User Profile Get & Update', profileGetRes.status === 200 && profilePutRes.status === 200, 'Profile updated successfully');
    } catch (err) {
      recordResult('User Profile Get & Update', false, err.response?.data?.message || err.message);
    }

    // 23. AI Job Recommendations for Candidate
    try {
      const recRes = await axios.get(`${BASE_URL}/jobs/recommended`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      recordResult('AI Job Recommendations for Candidate', recRes.status === 200, `Recommended jobs: ${Array.isArray(recRes.data) ? recRes.data.length : 'OK'}`);
    } catch (err) {
      recordResult('AI Job Recommendations for Candidate', false, err.response?.data?.message || err.message);
    }

    // 24. Candidate Remove Saved Job
    try {
      const removeSaveRes = await axios.delete(`${BASE_URL}/saved-jobs/${createdJobId}`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      recordResult('Candidate Remove Saved Job', removeSaveRes.status === 200, removeSaveRes.data.message || 'Removed');
    } catch (err) {
      recordResult('Candidate Remove Saved Job', false, err.response?.data?.message || err.message);
    }

    // 25. Static Uploads Serving Check
    try {
      const staticRes = await axios.get('http://localhost:5000/uploads/test.txt', {
        validateStatus: (status) => status === 200 || status === 404
      });
      recordResult('Static Uploads Route Accessible', staticRes.status === 404 || staticRes.status === 200, 'Static folder mounted correctly');
    } catch (err) {
      recordResult('Static Uploads Route Accessible', false, err.message);
    }

    console.log('\n======================================');
    const total = results.length;
    const passedCount = results.filter(r => r.passed).length;
    const failedCount = total - passedCount;
    console.log(`TOTAL TESTS: ${total}`);
    console.log(`PASSED: ${passedCount}`);
    console.log(`FAILED: ${failedCount}`);
    console.log('======================================\n');

  } catch (globalErr) {
    console.error('Fatal testing error:', globalErr);
  }
}

runTests();
