/**
 * Migration script — uploads all local assets to Sanity.
 *
 * Usage: node scripts/migrate-to-sanity.mjs
 *
 * Requires: SANITY_API_TOKEN with Editor/Admin role
 * Set via: export SANITY_API_TOKEN=your_token_here
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { basename } from "path";

const PROJECT_ID = "6l6xp9sd";
const DATASET = "production";
const API_VERSION = "2026-04-29";

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("❌ Set SANITY_API_TOKEN first:");
  console.error("   Go to sanity.io/manage → your project → API → Tokens → Add API Token");
  console.error("   Role: Editor");
  console.error("   Then: export SANITY_API_TOKEN=your_token_here");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

async function uploadImage(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${filePath}`);
    return null;
  }
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: basename(filePath),
  });
  console.log(`  ✓ Uploaded image: ${basename(filePath)}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function uploadFile(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${filePath}`);
    return null;
  }
  console.log(`  ↑ Uploading ${basename(filePath)} (${(readFileSync(filePath).length / 1024 / 1024).toFixed(1)}MB)...`);
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("file", buffer, {
    filename: basename(filePath),
  });
  console.log(`  ✓ Uploaded file: ${basename(filePath)}`);
  return { _type: "file", asset: { _type: "reference", _ref: asset._id } };
}

// ─── Site Settings ───
async function migrateSiteSettings() {
  console.log("\n📋 Site Settings...");

  const aboutImage = await uploadImage("public/images/band/hero-group.jpg");
  const heroVideo = await uploadFile("public/video/featured.mp4");

  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    bandName: "Silver Lining Band",
    tagline: "The songs you know, played live — keeping the classics alive.",
    aboutQuote: "Every cloud has a silver lining — ours just comes with a setlist.",
    contactEmail: "",
    socialLinks: {
      instagram: "https://www.instagram.com/therealsilverliningband/",
      facebook: "https://www.facebook.com/therealsilverliningband/",
      youtube: "https://www.youtube.com/@SilverLining-Ottawa/featured",
    },
  };

  if (aboutImage) doc.aboutImage = aboutImage;
  if (heroVideo) doc.heroVideo = heroVideo;

  await client.createOrReplace(doc);
  console.log("  ✓ Site Settings created");
}

// ─── Shows ───
async function migrateShows() {
  console.log("\n🎤 Shows...");

  const shows = [
    {
      _id: "show-remic-1",
      title: "Remic Rapids",
      date: "2026-06-14T18:00:00.000Z",
      venue: "Remic Rapids Park",
      address: "Remic Rapids, Sir John A. Macdonald Pkwy, Ottawa, ON",
      city: "Ottawa, ON",
      imagePath: "public/images/band/gallery-remic-group.jpg",
      description: "Outdoor summer series by the river. Bring a lawn chair and enjoy classic rock as the sun sets over the rapids.",
    },
    {
      _id: "show-sonnys-1",
      title: "Sonny's",
      date: "2026-06-28T20:00:00.000Z",
      venue: "Sonny's Bar & Grill",
      address: "1374 Old Montreal Rd, Cumberland, ON K4C 1E3",
      city: "Cumberland, ON",
      imagePath: "public/images/band/venue-sonnys.jpg",
      description: "Saturday night live music. Full setlist — Fleetwood Mac, Eagles, Beatles & more.",
    },
    {
      _id: "show-broadhead",
      title: "Broadhead Brewing",
      date: "2026-07-11T19:00:00.000Z",
      venue: "Broadhead Brewing Company",
      address: "73 Lorne Ave, Ottawa, ON K1S 0C2",
      city: "Ottawa, ON",
      imagePath: "public/images/band/venue-broadhead.jpg",
      description: "Craft beer and classic rock — what more could you want? Patio session weather permitting.",
    },
    {
      _id: "show-nogo",
      title: "No Go Cafe",
      date: "2026-07-25T19:30:00.000Z",
      venue: "No Go Cafe",
      address: "264 Dalhousie St, Ottawa, ON K1N 7E6",
      city: "Ottawa, ON",
      imagePath: "public/images/band/gallery-no-go.jpg",
      description: "Intimate acoustic set in the heart of the ByWard Market. Limited seating — arrive early.",
    },
    {
      _id: "show-remic-2",
      title: "Remic Rapids",
      date: "2026-08-09T18:00:00.000Z",
      venue: "Remic Rapids Park",
      address: "Remic Rapids, Sir John A. Macdonald Pkwy, Ottawa, ON",
      city: "Ottawa, ON",
      imagePath: "public/images/band/gallery-remic-night.jpg",
      description: "Back by popular demand. Golden hour classics by the Ottawa River.",
    },
  ];

  for (const show of shows) {
    const { imagePath, ...data } = show;
    const image = await uploadImage(imagePath);
    const doc = { ...data, _type: "show" };
    if (image) doc.image = image;
    await client.createOrReplace(doc);
    console.log(`  ✓ Show: ${show.title} (${show.date.slice(0, 10)})`);
  }
}

// ─── Gallery Images ───
async function migrateGallery() {
  console.log("\n📸 Gallery Images...");

  const images = [
    // Live shots
    { id: "gallery-remic-group", path: "public/images/band/gallery-remic-group.jpg", caption: "Live at Remic Rapids", category: "live" },
    { id: "gallery-helen-bw", path: "public/images/band/gallery-helen-bw.jpg", caption: "Helen at the mic", category: "live" },
    { id: "gallery-greg", path: "public/images/band/gallery-greg.jpg", caption: "Greg on guitar", category: "live" },
    { id: "gallery-remic-night", path: "public/images/band/gallery-remic-night.jpg", caption: "Night performance at Remic", category: "live" },
    { id: "gallery-nancy-helen", path: "public/images/band/gallery-nancy-helen.jpg", caption: "Nancy and Helen at Homestead", category: "live" },
    { id: "gallery-dom-remic", path: "public/images/band/gallery-dom-remic.jpg", caption: "Dom at Remic Rapids", category: "live" },
    { id: "gallery-steve-remic", path: "public/images/band/gallery-steve-remic.jpg", caption: "Steve at Remic", category: "live" },
    { id: "gallery-band-remic", path: "public/images/band/gallery-band-remic.jpg", caption: "The full band at Remic", category: "live" },
    { id: "gallery-helen-dom", path: "public/images/band/gallery-helen-dom.jpg", caption: "Helen and Dom", category: "live" },
    { id: "gallery-no-go", path: "public/images/band/gallery-no-go.jpg", caption: "Full band at No Go Cafe", category: "live" },
    // B&W portraits
    { id: "gallery-nancy-bw", path: "public/images/band/nancy-bw.jpg", caption: "Nancy", category: "promo" },
    { id: "gallery-dom-bw", path: "public/images/band/dom-bw.jpg", caption: "Dom", category: "promo" },
    { id: "gallery-greg-bw", path: "public/images/band/greg-bw.jpg", caption: "Greg", category: "promo" },
    { id: "gallery-steve-bw", path: "public/images/band/steve-bw.jpg", caption: "Steve", category: "promo" },
    // Additional shots
    { id: "gallery-dom-homestead", path: "public/images/band/dom-homestead.jpg", caption: "Dom at Homestead", category: "live" },
    { id: "gallery-helen-homestead", path: "public/images/band/helen-homestead.jpg", caption: "Helen at Homestead", category: "live" },
    { id: "gallery-steve-homestead-bw", path: "public/images/band/steve-homestead-bw.jpg", caption: "Steve at Homestead", category: "live" },
    { id: "gallery-steve-homestead-colour", path: "public/images/band/steve-homestead-colour.jpg", caption: "Steve at Homestead", category: "live" },
    { id: "gallery-nancy-greg-steve", path: "public/images/band/nancy-greg-steve-bw.jpg", caption: "Nancy, Greg and Steve", category: "live" },
    { id: "gallery-greg-remic", path: "public/images/band/greg-remic.jpg", caption: "Greg at Remic", category: "live" },
    { id: "gallery-golden-hour", path: "public/images/band/remic-group-golden.jpg", caption: "Golden hour at Remic Rapids", category: "promo" },
    { id: "gallery-group-photo", path: "public/images/band/group-photo.jpg", caption: "Silver Lining Band", category: "promo" },
    { id: "gallery-about-helen", path: "public/images/band/about-helen.jpg", caption: "Helen performing", category: "live" },
    // Venue shots
    { id: "gallery-venue-broadhead", path: "public/images/band/venue-broadhead.jpg", caption: "At Broadhead Brewing", category: "live" },
    { id: "gallery-venue-homestead", path: "public/images/band/venue-homestead.jpg", caption: "At The Homestead", category: "live" },
    { id: "gallery-venue-sonnys", path: "public/images/band/venue-sonnys.jpg", caption: "At Sonny's", category: "live" },
  ];

  for (const img of images) {
    const image = await uploadImage(img.path);
    if (!image) continue;
    await client.createOrReplace({
      _id: img.id,
      _type: "galleryImage",
      image,
      caption: img.caption,
      category: img.category,
    });
    console.log(`  ✓ Gallery: ${img.caption}`);
  }
}

// ─── Videos ───
async function migrateVideos() {
  console.log("\n🎬 Videos...");

  const videos = [
    { id: "video-be-my-baby", path: "public/video/featured.mp4", title: "Be My Baby", venue: "Sonny's", order: 1 },
    { id: "video-fishermans-blues", path: "public/video/fishermans-blues.mp4", title: "Fishermans Blues", venue: "Remic Rapids", order: 2 },
    { id: "video-cant-let-go", path: "public/video/cant-let-go.mp4", title: "Can't Let Go", venue: "Cumberland", order: 3 },
    { id: "video-without-love", path: "public/video/without-love.mp4", title: "Without Love", venue: "Sonny's", order: 4 },
    { id: "video-the-longest-time", path: "public/video/the-longest-time.mp4", title: "The Longest Time", venue: "Live", order: 5 },
    { id: "video-live-clip", path: "public/video/live-clip.mp4", title: "Live Session", venue: "On Stage", order: 6 },
    { id: "video-blue-bayou", path: "public/video/blue-bayou.mp4", title: "Blue Bayou", venue: "Sonny's", order: 7 },
    { id: "video-hurricane", path: "public/video/hurricane.mp4", title: "Hurricane", venue: "Sonny's", order: 8 },
    { id: "video-cant-let-go-homestead", path: "public/video/cant-let-go-homestead.mp4", title: "Can't Let Go", venue: "Homestead", order: 9 },
    { id: "video-eye-in-the-sky", path: "public/video/eye-in-the-sky.mp4", title: "Eye in the Sky", venue: "Homestead", order: 10 },
    { id: "video-aime", path: "public/video/aime.mp4", title: "Aimé", venue: "Live", order: 11 },
  ];

  for (const vid of videos) {
    const videoFile = await uploadFile(vid.path);
    if (!videoFile) continue;
    await client.createOrReplace({
      _id: vid.id,
      _type: "video",
      title: vid.title,
      venue: vid.venue,
      videoFile,
      order: vid.order,
    });
    console.log(`  ✓ Video: ${vid.title}`);
  }
}

// ─── Run ───
async function main() {
  console.log("🚀 Migrating content to Sanity...");
  console.log(`   Project: ${PROJECT_ID} / ${DATASET}\n`);

  await migrateSiteSettings();
  await migrateShows();
  await migrateGallery();
  await migrateVideos();

  console.log("\n✅ Migration complete!");
  console.log("   Visit your site's /studio to verify everything looks right.");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
