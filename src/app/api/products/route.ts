import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const migrate = searchParams.get('migrate');

    if (migrate === 'true') {
      try {
        console.log('Migration started...');
        
        // 1. Sync Settings
        const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
        const localSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        await supabase.from('settings').upsert({ 
          id: 1, 
          admin_password: localSettings.adminPassword || 'admin',
          free_shipping_threshold: localSettings.freeShippingThreshold || 99,
          shipping_fee: localSettings.shippingFee || 15,
          hero_image: localSettings.heroImage || '',
          hero_title: localSettings.heroTitle || '',
          hero_subtitle: localSettings.heroSubtitle || ''
        });

        // 2. Sync Products
        const productsFile = path.join(process.cwd(), 'src', 'data', 'products.ts');
        const fileContent = fs.readFileSync(productsFile, 'utf-8');
        const jsonPart = fileContent.substring(fileContent.indexOf('=') + 1).trim().replace(/;$/, '');
        const localProducts = JSON.parse(jsonPart);
        
        const mappedProducts = localProducts.map((p: any) => {
          const { detailImages, ...rest } = p;
          return {
            ...rest,
            detail_images: detailImages || []
          };
        });

        await supabase.from('products').upsert(mappedProducts);

        return NextResponse.json({ success: 'Migration finished successfully. All local data is now in the cloud!' });
      } catch (e: any) {
        console.error('Migration error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }

    // 1. Fetch Products
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    // 2. Fetch Settings
    const { data: sData, error: sError } = await supabase
      .from('settings')
      .select('*')
      .maybeSingle();

    if (pError) {
      console.error('Supabase products error:', pError);
      return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
    }

    // Map database snake_case to frontend camelCase
    const mappedProducts = (products || []).map((p: any) => ({
      ...p,
      variants: p.variants || [],
      detailImages: p.detail_images || []
    }));

    const mappedSettings = sData ? {
      adminPassword: sData.admin_password,
      freeShippingThreshold: sData.free_shipping_threshold,
      shippingFee: sData.shipping_fee,
      heroImage: sData.hero_image,
      heroTitle: sData.hero_title,
      heroSubtitle: sData.hero_subtitle,
      contactWhatsApp: sData.contact_whatsapp,
      contactEmail: sData.contact_email,
      contactTikTok: sData.contact_tiktok,
      contactInstagram: sData.contact_instagram,
      liveLink: sData.live_link,
      categoryStandard: sData.category_standard,
      categoryGameplay: sData.category_gameplay,
      categorySpecial: sData.category_special
    } : { 
      freeShippingThreshold: 99, 
      shippingFee: 15, 
      adminPassword: 'admin',
      heroImage: '',
      heroTitle: '',
      heroSubtitle: '',
      contactWhatsApp: '',
      contactEmail: '',
      contactTikTok: '',
      contactInstagram: '',
      liveLink: '',
      categoryStandard: 'Standard Breaks',
      categoryGameplay: 'Game Modes',
      categorySpecial: 'Special Drops'
    };

    return NextResponse.json({
      products: mappedProducts,
      settings: mappedSettings
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products, settings } = body;

    // 1. Update Settings
    if (settings) {
      const { adminPassword, freeShippingThreshold, shippingFee, heroImage, heroTitle, heroSubtitle, contactWhatsApp, contactEmail, contactTikTok, contactInstagram, liveLink, categoryStandard, categoryGameplay, categorySpecial } = settings;
      const { error: sError } = await supabase
        .from('settings')
        .upsert({ 
          id: 1, 
          admin_password: adminPassword,
          free_shipping_threshold: freeShippingThreshold,
          shipping_fee: shippingFee,
          hero_image: heroImage,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          contact_whatsapp: contactWhatsApp,
          contact_email: contactEmail,
          contact_tiktok: contactTikTok,
          contact_instagram: contactInstagram,
          live_link: liveLink,
          category_standard: categoryStandard,
          category_gameplay: categoryGameplay,
          category_special: categorySpecial
        });
      if (sError) throw sError;
    }

    // 2. Update Products
    if (products && Array.isArray(products)) {
      // Map frontend camelCase to database snake_case
      const mappedProducts = products.map((p: any) => {
        const { detailImages, ...rest } = p;
        return {
          ...rest,
          detail_images: detailImages || []
        };
      });

      // Clear and re-insert
      await supabase.from('products').delete().neq('id', '0');
      const { error: iError } = await supabase.from('products').insert(mappedProducts);
      if (iError) throw iError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
