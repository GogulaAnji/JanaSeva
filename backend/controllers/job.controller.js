import Job from '../models/Job.js';

export const createJob = async (req, res) => {
    try {
        const job = await Job.create({ postedBy: req.user.id, ...req.body });
        res.status(201).json({ success: true, message: 'Job posted successfully', job });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create job', error: error.message });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const { page = 1, limit = 20, status = 'active' } = req.query;
        const jobs = await Job.find({ status }).populate('postedBy', 'name phone').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
        const count = await Job.countDocuments({ status });
        res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: page, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get jobs', error: error.message });
    }
};

export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name phone email');
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        job.viewsCount += 1;
        await job.save();
        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get job', error: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
        }
        Object.assign(job, req.body);
        await job.save();
        res.status(200).json({ success: true, message: 'Job updated successfully', job });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update job', error: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
        }
        await job.deleteOne();
        res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete job', error: error.message });
    }
};

export const searchJobs = async (req, res) => {
    try {
        const { category, jobType, location, minSalary, maxSalary } = req.query;
        const query = { status: 'active' };
        if (category) query.category = category;
        if (jobType) query.jobType = jobType;
        if (minSalary || maxSalary) {
            query['salary.min'] = {};
            if (minSalary) query['salary.min'].$gte = Number(minSalary);
            if (maxSalary) query['salary.max'].$lte = Number(maxSalary);
        }
        let jobs = await Job.find(query).populate('postedBy', 'name phone');
        if (location) {
            jobs = jobs.filter(job => job.location.district?.toLowerCase().includes(location.toLowerCase()) || job.location.state?.toLowerCase().includes(location.toLowerCase()));
        }
        res.status(200).json({ success: true, count: jobs.length, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
};

export const applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        const alreadyApplied = job.applications.find(app => app.applicant.toString() === req.user.id.toString());
        if (alreadyApplied) return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        job.applications.push({ applicant: req.user.id, resumeUrl: req.body.resumeUrl, coverLetter: req.body.coverLetter });
        await job.save();
        res.status(201).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to apply for job', error: error.message });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: jobs.length, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get jobs', error: error.message });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ 'applications.applicant': req.user.id }).populate('postedBy', 'name phone');
        const applications = jobs.map(job => {
            const app = job.applications.find(a => a.applicant.toString() === req.user.id.toString());
            return { job: { _id: job._id, title: job.title, company: job.companyName, postedBy: job.postedBy }, application: app };
        });
        res.status(200).json({ success: true, count: applications.length, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get applications', error: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const application = job.applications.id(req.params.applicationId);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        application.status = status;
        await job.save();
        res.status(200).json({ success: true, message: 'Application status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update application status', error: error.message });
    }
};
