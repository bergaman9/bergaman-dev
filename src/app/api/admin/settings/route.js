import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    const settings = await db.collection('settings').findOne({ type: 'site' });
    
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
        backupFrequency: 'weekly'
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
    const db = await connectDB();
    
    // Add metadata
    const settingsDocument = {
      ...settingsData,
      type: 'site',
      updatedAt: new Date()
    };

    // Upsert settings (update if exists, create if not)
    const result = await db.collection('settings').updateOne(
      { type: 'site' },
      { 
        $set: settingsDocument,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      message: 'Settings saved successfully',
      modified: result.modifiedCount > 0,
      upserted: result.upsertedCount > 0
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
} 