import { getBlogPost, getAllBlogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} - ClinicTech Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <style>{`
        .post-page { min-height: 100vh; background: #FAFBFD; }
        .post-header { max-width: 720px; margin: 0 auto; padding: 64px 40px 32px; }
        .post-category { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #3730A3; margin-bottom: 12px; }
        .post-title { font-family: var(--font-dm-serif), 'DM Serif Display', serif; font-size: 40px; font-weight: 400; color: #0F172A; line-height: 1.2; margin-bottom: 16px; }
        .post-meta { font-size: 14px; color: #94A3B8; margin-bottom: 32px; }
        .post-meta span { color: #64748B; font-weight: 500; }
        .post-body { max-width: 720px; margin: 0 auto; padding: 0 40px 80px; }
        .post-body h2 { font-size: 24px; font-weight: 700; color: #0F172A; margin: 40px 0 16px; line-height: 1.3; }
        .post-body h3 { font-size: 19px; font-weight: 700; color: #0F172A; margin: 32px 0 12px; line-height: 1.3; }
        .post-body p { font-size: 16px; color: #475569; line-height: 1.75; margin-bottom: 20px; }
        .post-body ul, .post-body ol { font-size: 16px; color: #475569; line-height: 1.75; margin-bottom: 20px; padding-left: 24px; }
        .post-body li { margin-bottom: 8px; }
        .post-body strong { color: #0F172A; }
        .post-body blockquote { border-left: 3px solid #3730A3; padding: 12px 20px; margin: 24px 0; background: #F8FAFC; border-radius: 0 8px 8px 0; }
        .post-body blockquote p { color: #334155; margin-bottom: 0; }
        .post-cta { max-width: 720px; margin: 0 auto 80px; padding: 0 40px; }
        .post-cta-box { background: linear-gradient(135deg, #3730A3 0%, #5EC4E3 100%); border-radius: 16px; padding: 40px; text-align: center; }
        .post-cta-box h3 { color: #fff; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
        .post-cta-box p { color: rgba(255,255,255,0.8); font-size: 15px; margin-bottom: 20px; }
        .post-cta-btn { display: inline-block; background: #fff; color: #3730A3; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; transition: all 0.2s; }
        .post-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        @media (max-width: 640px) {
          .post-header { padding: 40px 20px 24px; }
          .post-title { font-size: 28px; }
          .post-body { padding: 0 20px 60px; }
          .post-nav { padding: 16px 20px; }
          .post-cta { padding: 0 20px; }
          .post-cta-box { padding: 28px 20px; }
        }
      `}</style>
      <div className="post-page">
        <SiteNav />

        <div className="post-header">
          <div className="post-category">{post.category}</div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            By <span>{post.author}</span> &middot; {post.date} &middot; {post.readTime}
          </div>
        </div>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="post-cta">
          <div className="post-cta-box">
            <h3>Ready to modernize your clinic?</h3>
            <p>See what your custom platform looks like in 15 minutes.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer" className="post-cta-btn">Book Your Walkthrough &rarr;</a>
          </div>
        </div>
      </div>
    </>
  );
}
