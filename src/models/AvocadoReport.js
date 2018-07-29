import mongoose from 'mongoose';
import shortid from 'shortid';

const avocadoReportSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  where: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  postedBy: { type: String, ref: 'User', required: true },
  upvotedBy: { type: [String], default: [] },
  downvotedBy: { type: [String], default: [] },
});

async function getReports(offset = 0) {
  const reports = await this.find()
    .skip(offset)
    .limit(50)
    .sort({ timestamp: -1 })
    .select('-postedBy');
  return { offset, reports };
}

async function getReportsByUserID(userID) {
  return this.find({ postedBy: userID });
}

async function upvote(reportID, userID) {
  const report = await this.findOne({ _id: reportID });
  if (!report) {
    throw new Error('Report not found');
  }
  if (!report.upvotedBy.includes(userID)) {
    report.upvotedBy.push(userID);
  }
  if (report.downvotedBy.includes(userID)) {
    const index = report.downvotedBy.findIndex(id => id === userID);
    report.downvotedBy.splice(index, 1);
  }
  await report.save();
}

async function downvote(reportID, userID) {
  const report = await this.findOne({ _id: reportID });
  if (!report) {
    throw new Error('Report not found');
  }
  if (!report.downvotedBy.includes(userID)) {
    report.downvotedBy.push(userID);
  }
  if (report.upvotedBy.includes(userID)) {
    const index = report.upvotedBy.findIndex(id => id === userID);
    report.upvotedBy.splice(index, 1);
  }
  await report.save();
}

avocadoReportSchema.statics.getReports = getReports;
avocadoReportSchema.statics.getReportsByUserID = getReportsByUserID;
avocadoReportSchema.statics.upvote = upvote;
avocadoReportSchema.statics.downvote = downvote;
const AvocadoReport = mongoose.model('AvocadoReport', avocadoReportSchema);
export default AvocadoReport;
