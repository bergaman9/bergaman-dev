import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/bergaman-dev');
    await client.connect();
    const db = client.db();
    const settings = await db.collection('settings').findOne({ type: 'site' });
    await client.close();
    
    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        siteName: 'Bergaman - The Dragon\'s Domain',
        siteDescription: 'Personal portfolio and blog of Ömer, Electrical & Electronics Engineer',
        adminEmail: 'omerguler53@gmail.com',
        allowComments: true,
        moderateComments: true,
        allowContactForm: true,
        maintenanceMode: false,
        analyticsEnabled: true,
        backupFrequency: 'weekly',
        seoEnabled: true,
        socialMediaEnabled: true,
        newsletterEnabled: false,
        darkModeEnabled: true,
        compressionEnabled: true,
        cacheEnabled: true,
        // Blog Settings
        blogPostsPerPage: 9,
        blogShowExcerpts: true,
        blogAllowGuestComments: true,
        blogRequireApproval: true,
        // Post Security Settings
        allowPasswordProtected: true,
        allowMemberOnly: true,
        defaultPostVisibility: 'public',
        // Author Profile Settings
        authorProfile: {
          name: 'Bergaman',
          bio: 'Electrical & Electronics Engineer specializing in full-stack development and AI technologies.',
          about: '',
          avatar: '/images/profile/profile.png',
          showAuthorBio: true,
          social: {
            github: 'https://github.com/bergaman9',
            linkedin: 'https://www.linkedin.com/in/omerguler/',
            twitter: '',
            website: 'https://bergaman.dev'
          }
        }
      };
      return NextResponse.json(defaultSettings);
    }

    // Remove MongoDB-specific fields
    const { _id, type, ...settingsData } = settings;
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const settingsData = await request.json();
    await connectDB();
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/bergaman-dev');
    await client.connect();
    const db = client.db();
    
    // Check if settings exist
    const existingSettings = await db.collection('settings').findOne({ type: 'site' });
    
    if (existingSettings) {
      // Update existing settings (exclude createdAt to avoid conflict)
      const updateData = {
        ...settingsData,
        type: 'site',
        updatedAt: new Date()
      };
      
      const result = await db.collection('settings').updateOne(
        { type: 'site' },
        { $set: updateData }
      );
      await client.close();
      
      return NextResponse.json({ 
        message: 'Settings updated successfully',
        modified: result.modifiedCount > 0
      });
    } else {
      // Create new settings
      const settingsDocument = {
        ...settingsData,
        type: 'site',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('settings').insertOne(settingsDocument);
      await client.close();
      
      return NextResponse.json({ 
        message: 'Settings created successfully',
        inserted: result.insertedId ? true : false
      });
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
} 