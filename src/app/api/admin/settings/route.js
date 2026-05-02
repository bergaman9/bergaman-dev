import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { jsonError, pickAllowedFields, readJsonLimited } from '../../../../lib/serverSecurity';

const SETTINGS_FIELDS = [
  'siteName',
  'siteDescription',
  'adminEmail',
  'allowComments',
  'moderateComments',
  'allowContactForm',
  'maintenanceMode',
  'analyticsEnabled',
  'backupFrequency',
  'seoEnabled',
  'socialMediaEnabled',
  'newsletterEnabled',
  'darkModeEnabled',
  'compressionEnabled',
  'cacheEnabled',
  'blogPostsPerPage',
  'blogShowExcerpts',
  'blogAllowGuestComments',
  'blogRequireApproval',
  'allowPasswordProtected',
  'allowMemberOnly',
  'defaultPostVisibility',
  'authorProfile',
];

async function getSettingsCollection() {
  const connection = await connectDB();
  const db = connection?.db || connection?.connection?.db;

  if (!db) {
    throw Object.assign(new Error('Database connection is not available'), { status: 503 });
  }

  return db.collection('settings');
}

export async function GET() {
  try {
    const settingsCollection = await getSettingsCollection();
    const settings = await settingsCollection.findOne({ type: 'site' });

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
    return jsonError(error, 500);
  }
}

export async function POST(request) {
  try {
    const body = await readJsonLimited(request, { maxBytes: 64 * 1024 });
    const settingsData = pickAllowedFields(body, SETTINGS_FIELDS);
    const settingsCollection = await getSettingsCollection();

    // Check if settings exist
    const existingSettings = await settingsCollection.findOne({ type: 'site' });

    if (existingSettings) {
      // Update existing settings (exclude createdAt to avoid conflict)
      const updateData = {
        ...settingsData,
        type: 'site',
        updatedAt: new Date()
      };

      const result = await settingsCollection.updateOne(
        { type: 'site' },
        { $set: updateData }
      );

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

      const result = await settingsCollection.insertOne(settingsDocument);

      return NextResponse.json({
        message: 'Settings created successfully',
        inserted: result.insertedId ? true : false
      });
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return jsonError(error, 500);
  }
}
