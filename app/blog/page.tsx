import { getAllBlogPosts } from "@/lib/blog-data";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Blog — ClinicTech",
  description: "Insights on growing your regenerative medicine clinic with better operations, patient management, and digital strategy.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <style>{`
        .blog-page { min-height: 100vh; background: #FAFBFD; }
        .blog-hero { padding: 160px 40px 48px; text-align: center; }
        .blog-hero h1 { font-family: var(--font-nunito), 'Nunito', sans-serif; font-size: 44px; font-weight: 800; font-style: italic; color: #1A1A2E; margin-bottom: 16px; }
        .blog-hero p { font-size: 17px; color: #64748B; max-width: 560px; margin: 0 auto; line-height: 1.6; }
        .blog-grid { max-width: 1000px; margin: 0 auto; padding: 0 40px 80px; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .blog-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; transition: all 0.2s; text-decoration: none; color: inherit; display: flex; flex-direction: column; }
        .blog-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .blog-card-img { height: 180px; background: linear-gradient(135deg, #3730A3 0%, #5EC4E3 100%); display: flex; align-items: center; justify-content: center; }
        .blog-card-img span { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.8); padding: 6px 14px; border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; }
        .blog-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .blog-card-meta { font-size: 12px; color: #94A3B8; margin-bottom: 8px; }
        .blog-card-title { font-size: 18px; font-weight: 700; color: #0F172A; line-height: 1.35; margin-bottom: 8px; }
        .blog-card-excerpt { font-size: 14px; color: #64748B; line-height: 1.5; flex: 1; }
        .blog-card-read { font-size: 13px; font-weight: 600; color: #3730A3; margin-top: 12px; }
        .blog-empty { text-align: center; padding: 80px 40px; color: #94A3B8; }
        .blog-empty h2 { font-size: 20px; font-weight: 600; color: #64748B; margin-bottom: 8px; }
        @media (max-width: 640px) {
          .blog-hero h1 { font-size: 30px; }
          .blog-grid { grid-template-columns: 1fr; padding: 0 20px 60px; }
          .blog-nav { padding: 16px 20px; }
          .blog-hero { padding: 140px 20px 32px; }
        }
      `}</style>
      <div className="blog-page">
        <SiteNav />

        <div className="blog-hero">
          <h1>The ClinicTech Blog</h1>
          <p>Insights on growing your regenerative medicine clinic with better operations, patient management, and digital strategy.</p>
        </div>

        {posts.length > 0 ? (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card-img">
                  <span>{post.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">{post.date} &middot; {post.readTime}</div>
                  <div className="blog-card-title">{post.title}</div>
                  <div className="blog-card-excerpt">{post.excerpt}</div>
                  <div className="blog-card-read">Read more &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <h2>Coming Soon</h2>
            <p>We&apos;re working on great content for clinic owners. Check back soon.</p>
          </div>
        )}
      </div>
    </>
  );
}
