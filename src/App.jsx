
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Bot,
  Code2,
  Gamepad2,
  Globe,
  Palette,
  ShieldCheck,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  LockKeyhole,
  LogOut,
  ArrowUpRight,
  Zap,
  MessageCircle,
  Bell,
  Mail,
  Terminal,
  WandSparkles,
} from "lucide-react";
import { supabase } from "./lib/supabase";

const CATEGORIES = [
  "Tất cả",
  "Lập trình",
  "Game Dev",
  "Cộng đồng",
  "Thiết kế",
  "Sáng tạo",
];

const EDITABLE_CATEGORIES = CATEGORIES.filter(
  (category) => category !== "Tất cả"
);

const ICON_MAP = {
  globe: Globe,
  game: Gamepad2,
  bot: Bot,
  code: Code2,
  palette: Palette,
  spark: WandSparkles,
};

const STARTER_PROMPTS = [
  {
    title: "AI Lập Trình Website",
    category: "Lập trình",
    icon: "globe",
    tag: "Dành cho người mới",
    description:
      "Biến AI thành lập trình viên web chuyên nghiệp, hướng dẫn từng bước và viết code hoàn chỉnh.",
    prompt: `Bạn là một Senior Full-stack Developer kiêm người hướng dẫn tận tâm.

NGUYÊN TẮC LÀM VIỆC:
1. Làm rõ mục tiêu và công nghệ của dự án.
2. Hướng dẫn từng bước bằng tiếng Việt dễ hiểu cho người mới.
3. Khi viết code, cung cấp mã hoàn chỉnh, tên file và đường dẫn cụ thể.
4. Không dùng dấu ba chấm để bỏ qua phần code quan trọng.
5. Hướng dẫn cách cài đặt, chạy, kiểm thử và sửa lỗi.
6. Ưu tiên bảo mật, responsive, hiệu năng và khả năng bảo trì.
7. Không tuyên bố đã chạy thử nếu chưa thực sự kiểm thử.
8. Không để lộ mật khẩu, API secret hoặc service-role key trong frontend.

BẮT ĐẦU:
Hãy xác định mục tiêu website, đề xuất công nghệ phù hợp và chia công việc thành những bước có thể hoàn thành lần lượt.`,
    is_published: true,
  },
  {
    title: "AI Phát Triển Game",
    category: "Game Dev",
    icon: "game",
    tag: "Game Developer",
    description:
      "Thiết kế gameplay, hệ thống game và kiến trúc có thể mở rộng.",
    prompt: `Bạn là Game Developer chuyên nghiệp, am hiểu thiết kế gameplay, kiến trúc phần mềm và tối ưu hiệu năng.

Khi hỗ trợ tôi:
- Làm rõ engine, nền tảng, thể loại game và trình độ của tôi.
- Chia game thành những hệ thống có trách nhiệm rõ ràng.
- Viết code hoàn chỉnh theo từng file và giải thích cách tích hợp.
- Hướng dẫn chạy thử, kiểm thử và tìm lỗi.
- Ưu tiên hiệu năng, bảo mật, khả năng mở rộng và trải nghiệm người chơi.
- Với Roblox, sử dụng Luau và phân biệt Script, LocalScript, ModuleScript và RemoteEvent.
- Chỉ tạo công cụ cho dự án tôi sở hữu hoặc có quyền kiểm thử; không hỗ trợ exploit, đánh cắp tài khoản hoặc gian lận gây hại cho người khác.

Hãy bắt đầu bằng việc xác định game tôi muốn phát triển, sau đó lập kế hoạch và triển khai từng phần.`,
    is_published: true,
  },
  {
    title: "AI Build Server Discord",
    category: "Cộng đồng",
    icon: "bot",
    tag: "Community Builder",
    description:
      "Lên cấu trúc server, role, channel, ticket, bot và nội quy chuyên nghiệp.",
    prompt: `Bạn là Discord Community Architect chuyên thiết kế server hiện đại, an toàn và dễ quản lý.

Hãy giúp tôi xây dựng:
1. Category và channel với tên thống nhất.
2. Role, màu sắc, thứ tự role và quyền hạn cụ thể.
3. Nội quy ngắn gọn, rõ ràng và dễ thực hiện.
4. Welcome message, announcement và hướng dẫn thành viên.
5. Ticket support, quy trình xử lý và phân quyền staff.
6. Bot phù hợp cùng hướng dẫn thiết lập từng bước.
7. Checklist kiểm tra quyền để bảo vệ các khu vực riêng tư.

Trình bày bằng tiếng Việt, chuyên nghiệp và có thể sao chép trực tiếp vào Discord. Hãy hỏi thêm thông tin nếu thực sự cần thiết.`,
    is_published: true,
  },
  {
    title: "AI Viết Script & Tool",
    category: "Lập trình",
    icon: "code",
    tag: "Code Assistant",
    description:
      "Viết script có cấu trúc rõ ràng, xử lý lỗi và hướng dẫn kiểm thử.",
    prompt: `Bạn là Software Engineer chuyên viết script, automation và công cụ hỗ trợ phát triển phần mềm.

Quy trình làm việc:
- Xác định môi trường chạy, phiên bản, đầu vào và đầu ra.
- Giải thích kiến trúc trước khi triển khai.
- Viết code đầy đủ theo từng file.
- Xử lý lỗi và kiểm tra dữ liệu đầu vào.
- Nêu rõ dependency, cách cài đặt, chạy và kiểm thử.
- Không tự bịa API hoặc thư viện.
- Chỉ hỗ trợ hệ thống tôi sở hữu hoặc được phép sử dụng; không hỗ trợ đánh cắp tài khoản, truy cập trái phép hoặc công cụ gian lận gây hại cho người khác.

Hãy hỏi tôi muốn tự động hóa công việc gì và đang sử dụng nền tảng nào.`,
    is_published: true,
  },
  {
    title: "AI Thiết Kế UI/UX Gaming",
    category: "Thiết kế",
    icon: "palette",
    tag: "Creative Studio",
    description:
      "Xây dựng giao diện gaming hiện đại, responsive và dễ sử dụng.",
    prompt: `Bạn là UI/UX Designer chuyên thiết kế sản phẩm số theo phong cách gaming hiện đại, tinh gọn và chuyên nghiệp.

Hãy làm việc theo quy trình:
- Xác định người dùng mục tiêu và hành động quan trọng nhất.
- Đề xuất bảng màu, typography, khoảng cách, icon và hiệu ứng.
- Thiết kế layout cùng các component có thể tái sử dụng.
- Xử lý trạng thái loading, empty, error và success.
- Ưu tiên desktop, tablet, mobile, độ tương phản và accessibility.
- Tránh hiệu ứng quá dày đặc làm giảm khả năng đọc.
- Nếu tạo giao diện bằng code, cung cấp file hoàn chỉnh và cách tích hợp.

Hãy làm rõ yêu cầu sản phẩm và phong cách mong muốn trước khi thiết kế.`,
    is_published: true,
  },
  {
    title: "AI Nội Dung & Marketing",
    category: "Sáng tạo",
    icon: "spark",
    tag: "Content Creator",
    description:
      "Lên ý tưởng nội dung, bài đăng và kế hoạch phát triển thương hiệu.",
    prompt: `Bạn là Content Strategist và Digital Marketer chuyên biến ý tưởng thành nội dung có mục tiêu rõ ràng.

Trước khi viết, hãy xác định:
- Nền tảng đăng bài.
- Đối tượng mục tiêu.
- Giọng điệu và nhận diện thương hiệu.
- Mục tiêu nội dung và lời kêu gọi hành động.

Nguyên tắc:
- Viết nội dung phù hợp với từng nền tảng.
- Tránh sáo rỗng và lặp từ.
- Khi phù hợp, đưa ra bản ngắn, bản tiêu chuẩn và bản nổi bật.
- Không tự bịa số liệu, đánh giá khách hàng hoặc cam kết kết quả.
- Đề xuất cách theo dõi và cải thiện hiệu quả.

Hãy bắt đầu bằng cách hỏi về thương hiệu, đối tượng và nền tảng tôi muốn phát triển.`,
    is_published: true,
  },
];

function mapPrompt(row) {
  return {
    id: row.id,
    title: row.title ?? "",
    category: row.category ?? "Lập trình",
    icon: row.icon ?? "bot",
    tag: row.tag ?? "Prompt cộng đồng",
    description: row.description ?? "",
    prompt: row.content ?? "",
    is_published: Boolean(row.is_published),
    created_at: row.created_at,
  };
}

function getPromptPayload(prompt) {
  return {
    title: prompt.title.trim(),
    category: prompt.category,
    icon: prompt.icon,
    tag: prompt.tag.trim() || "Prompt cộng đồng",
    description: prompt.description.trim(),
    content: prompt.prompt.trim(),
    is_published: Boolean(prompt.is_published),
  };
}

export default function App() {
  const [prompts, setPrompts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [copied, setCopied] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [editing, setEditing] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  const loadPrompts = useCallback(async (adminMode = false) => {
    setLoading(true);
    setLoadError("");

    let request = supabase
      .from("prompts")
      .select(
        "id,title,category,icon,tag,description,content,is_published,created_at"
      )
      .order("created_at", { ascending: false });

    if (!adminMode) {
      request = request.eq("is_published", true);
    }

    const { data, error } = await request;

    if (error) {
      console.error("Không tải được prompts:", error);
      setPrompts([]);
      setLoadError(
        "Không tải được prompt từ Supabase. Hãy kiểm tra tên cột, Project URL, key và chính sách RLS."
      );
    } else {
      setPrompts((data ?? []).map(mapPrompt));
    }

    setLoading(false);
  }, []);

  const verifyAdmin = useCallback(async () => {
    const { data, error } = await supabase.rpc("is_promptforge_admin");
    return !error && data === true;
  }, []);

  // Khôi phục phiên đăng nhập khi người quản trị tải lại trang.
  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) {
        console.error("Không đọc được phiên đăng nhập:", error);
        await loadPrompts(false);
        return;
      }

      if (session?.user) {
        const isAdmin = await verifyAdmin();

        if (cancelled) return;

        if (isAdmin) {
          setLoggedIn(true);
          await loadPrompts(true);
          return;
        }

        await supabase.auth.signOut();
      }

      if (!cancelled) {
        setLoggedIn(false);
        await loadPrompts(false);
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [loadPrompts, verifyAdmin]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("vi");

    return prompts.filter((prompt) => {
      const matchesCategory =
        category === "Tất cả" || prompt.category === category;

      const searchable = [
        prompt.title,
        prompt.description,
        prompt.category,
        prompt.tag,
      ]
        .join(" ")
        .toLocaleLowerCase("vi");

      return matchesCategory && searchable.includes(search);
    });
  }, [prompts, query, category]);

  async function copyPrompt(prompt) {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(String(prompt.id));
      showToast("Đã copy prompt vào clipboard!");
      window.setTimeout(() => setCopied(""), 2200);
    } catch {
      showToast("Không thể copy tự động. Hãy mở prompt và sao chép thủ công.");
    }
  }

  async function login(event) {
    event.preventDefault();
    setAdminError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      setAdminError(
        error?.message || "Đăng nhập thất bại. Hãy kiểm tra email và mật khẩu."
      );
      return;
    }

    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
      await supabase.auth.signOut();
      setAdminError(
        "Tài khoản này chưa có quyền quản trị trong bảng public.admins."
      );
      return;
    }

    setLoggedIn(true);
    setPassword("");
    await loadPrompts(true);
    showToast("Đăng nhập Admin thành công.");
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showToast("Đăng xuất chưa thành công. Hãy thử lại.");
      return;
    }

    setLoggedIn(false);
    setAdminOpen(false);
    setEditing(null);
    setAdminError("");
    await loadPrompts(false);
    showToast("Đã đăng xuất Admin.");
  }

  async function savePrompt(event) {
    event.preventDefault();

    if (!loggedIn || saving) return;

    const form = new FormData(event.currentTarget);

    const draft = {
      id: editing?.id || null,
      title: String(form.get("title") || ""),
      category: String(form.get("category") || "Lập trình"),
      icon: String(form.get("icon") || "bot"),
      tag: String(form.get("tag") || ""),
      description: String(form.get("description") || ""),
      prompt: String(form.get("prompt") || ""),
      is_published: form.get("is_published") === "on",
    };

    if (
      !draft.title.trim() ||
      !draft.description.trim() ||
      !draft.prompt.trim()
    ) {
      showToast("Hãy điền tên, mô tả và nội dung prompt.");
      return;
    }

    setSaving(true);

    const payload = getPromptPayload(draft);

    const result = draft.id
      ? await supabase
          .from("prompts")
          .update(payload)
          .eq("id", draft.id)
      : await supabase.from("prompts").insert(payload);

    setSaving(false);

    if (result.error) {
      console.error("Lỗi khi lưu prompt:", result.error);
      showToast(`Không lưu được prompt: ${result.error.message}`);
      return;
    }

    setEditing(null);
    await loadPrompts(true);
    showToast("Đã lưu prompt vào Supabase.");
  }

  async function deletePrompt(id) {
    if (!loggedIn) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa prompt này khỏi cơ sở dữ liệu?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("prompts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Lỗi khi xóa prompt:", error);
      showToast(`Không xóa được prompt: ${error.message}`);
      return;
    }

    await loadPrompts(true);
    showToast("Đã xóa prompt.");
  }

  async function seedStarterPrompts() {
    if (!loggedIn || saving) return;

    const confirmed = window.confirm(
      "Thêm 6 prompt mẫu vào Supabase? Những prompt đang có sẽ không bị xóa."
    );

    if (!confirmed) return;

    setSaving(true);

    const payload = STARTER_PROMPTS.map(getPromptPayload);
    const { error } = await supabase.from("prompts").insert(payload);

    setSaving(false);

    if (error) {
      console.error("Lỗi khi thêm prompt mẫu:", error);
      showToast(`Không thêm được prompt mẫu: ${error.message}`);
      return;
    }

    await loadPrompts(true);
    showToast("Đã thêm 6 prompt mẫu vào Supabase.");
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">
            <Sparkles size={21} />
          </span>
          <span>
            Prompt<span className="brand-accent">Forge</span>
            <small>BYDUYUDEV</small>
          </span>
        </a>

        <nav className={mobileMenu ? "nav nav-open" : "nav"}>
          <a href="#library" onClick={() => setMobileMenu(false)}>
            Thư viện prompt
          </a>
          <a href="#how" onClick={() => setMobileMenu(false)}>
            Cách sử dụng
          </a>
          <a href="#contact" onClick={() => setMobileMenu(false)}>
            Liên hệ
          </a>
        </nav>

        <div className="top-actions">
          <button className="admin-button" onClick={() => setAdminOpen(true)}>
            <LockKeyhole size={15} /> Admin
          </button>
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenu((current) => !current)}
            aria-label="Mở menu"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse-dot" /> PROMPT LIBRARY · LEVEL UP YOUR AI
            </div>

            <h1>
              Đừng chỉ dùng AI.
              <br />
              <span>Hãy định hình</span> AI.
            </h1>

            <p className="hero-desc">
              Bộ sưu tập prompt giúp biến một AI thông thường thành trợ lý
              chuyên biệt cho từng dự án — từ lập trình, gaming đến xây dựng
              cộng đồng.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#library">
                Khám phá thư viện <ArrowUpRight size={17} />
              </a>
              <a className="text-button" href="#how">
                <span className="play-icon">▶</span> Cách hoạt động
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>
                  {String(prompts.length).padStart(2, "0")}
                  <span>+</span>
                </strong>
                <small>Prompt mẫu</small>
              </div>
              <i />
              <div>
                <strong>06</strong>
                <small>Danh mục</small>
              </div>
              <i />
              <div>
                <strong>FREE</strong>
                <small>Dùng miễn phí</small>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />

            <div className="core-card">
              <div className="core-top">
                <span className="window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="live-label">
                  <span /> AI SYSTEM ONLINE
                </span>
              </div>

              <div className="core-symbol">
                <div className="symbol-ring">
                  <Sparkles size={45} />
                </div>
              </div>

              <div className="core-title">
                PROMPT<span> ENGINE</span>
              </div>
              <div className="core-sub">PERSONALIZE YOUR AI</div>

              <div className="code-lines">
                <span>
                  <b>01</b> <em>role</em>: "Expert Assistant"
                </span>
                <span>
                  <b>02</b> <em>project</em>: "Your Vision"
                </span>
                <span>
                  <b>03</b> <em>output</em>: <u>Ready to build_</u>
                </span>
              </div>

              <div className="core-footer">
                <Zap size={13} /> POWERED BY YOUR IDEAS <span>v1.0</span>
              </div>
            </div>

            <div className="float-chip chip-top">
              <Code2 size={16} />
              <span>CODE MODE</span>
            </div>
            <div className="float-chip chip-bottom">
              <Gamepad2 size={17} />
              <span>GAMING READY</span>
            </div>
            <div className="sparkle s1">✳</div>
            <div className="sparkle s2">✦</div>
          </div>
        </section>

        <section className="ticker">
          <div>
            BUILD SMARTER <b>✳</b> PROMPT BETTER <b>✳</b> CREATE WITHOUT LIMITS{" "}
            <b>✳</b> BUILD SMARTER <b>✳</b> PROMPT BETTER <b>✳</b> CREATE
            WITHOUT LIMITS <b>✳</b>
          </div>
        </section>

        <section className="library wrap" id="library">
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 / THE COLLECTION</div>
              <h2>
                Thư viện <span>Prompt</span>
              </h2>
              <p>Chọn đúng vai trò. Mở khóa đúng tiềm năng.</p>
            </div>

            <div className="result-count">
              <strong>{String(filtered.length).padStart(2, "0")}</strong>
              <span> PROMPTS FOUND</span>
            </div>
          </div>

          <div className="library-controls">
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm prompt, dự án, lĩnh vực..."
              />
              <kbd>⌕</kbd>
            </div>

            <div className="category-list">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  className={category === item ? "category active" : "category"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loadError && (
            <div className="empty-state">
              <ShieldCheck size={28} />
              <h3>Không thể tải dữ liệu</h3>
              <p>{loadError}</p>
              <button
                className="text-button"
                onClick={() => loadPrompts(loggedIn)}
              >
                Thử tải lại
              </button>
            </div>
          )}

          {!loadError && loading && (
            <div className="empty-state">
              <Sparkles size={28} />
              <h3>Đang tải thư viện...</h3>
              <p>Đang lấy dữ liệu prompt từ Supabase.</p>
            </div>
          )}

          {!loadError && !loading && filtered.length > 0 && (
            <div className="prompt-grid">
              {filtered.map((prompt, index) => {
                const Icon = ICON_MAP[prompt.icon] || Bot;

                return (
                  <article className="prompt-card" key={prompt.id}>
                    <div className="card-top">
                      <span className="card-icon">
                        <Icon size={21} />
                      </span>
                      <span className="card-number">
                        PROMPT / {String(index + 1).padStart(2, "0")}
                      </span>
                      <button
                        className="dots-button"
                        aria-label={`Xem ${prompt.title}`}
                        onClick={() =>
                          setEditing({ ...prompt, viewOnly: true })
                        }
                      >
                        ↗
                      </button>
                    </div>

                    <span className="tag">{prompt.tag}</span>
                    <h3>{prompt.title}</h3>
                    <p className="card-desc">{prompt.description}</p>

                    <div className="card-meta">
                      <span>{prompt.category}</span>
                      <span>
                        <ShieldCheck size={13} /> Ready to use
                      </span>
                    </div>

                    <div className="card-bottom">
                      <button
                        className="copy-button"
                        onClick={() => copyPrompt(prompt)}
                      >
                        {copied === String(prompt.id) ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                        {copied === String(prompt.id)
                          ? "Đã copy"
                          : "Copy prompt"}
                      </button>
                      <button
                        className="preview-button"
                        onClick={() =>
                          setEditing({ ...prompt, viewOnly: true })
                        }
                      >
                        Xem prompt <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !loadError && filtered.length === 0 && (
            <div className="empty-state">
              <Search size={28} />
              <h3>Chưa tìm thấy prompt</h3>
              <p>
                {prompts.length === 0
                  ? "Chưa có prompt được xuất bản. Hãy đăng nhập Admin để thêm prompt."
                  : "Thử từ khóa khác hoặc chọn danh mục Tất cả."}
              </p>
              <button
                className="text-button"
                onClick={() => {
                  setQuery("");
                  setCategory("Tất cả");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </section>

        <section className="how-section" id="how">
          <div className="wrap">
            <div className="eyebrow">02 / SIMPLE WORKFLOW</div>
            <h2>
              Ba bước. <span>Một AI mới.</span>
            </h2>

            <div className="steps">
              <div className="step">
                <span className="step-num">01</span>
                <div className="step-icon">
                  <Search />
                </div>
                <h3>Chọn lĩnh vực</h3>
                <p>Tìm prompt đúng với dự án bạn đang làm.</p>
              </div>

              <div className="step-connector">⟶</div>

              <div className="step">
                <span className="step-num">02</span>
                <div className="step-icon">
                  <Copy />
                </div>
                <h3>Copy prompt</h3>
                <p>Sao chép toàn bộ chỉ với một nút bấm.</p>
              </div>

              <div className="step-connector">⟶</div>

              <div className="step">
                <span className="step-num">03</span>
                <div className="step-icon">
                  <Sparkles />
                </div>
                <h3>Dán vào AI</h3>
                <p>Gửi prompt cho AI và bắt đầu dự án của bạn.</p>
              </div>
            </div>

            <div className="tip-banner">
              <div className="tip-icon">
                <Zap />
              </div>
              <div>
                <strong>PRO TIP / Mẹo sử dụng</strong>
                <p>
                  Hãy mô tả mục tiêu, công nghệ và kết quả mong muốn sau khi
                  dán prompt để AI hỗ trợ sát nhu cầu hơn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="wrap">
          <div className="footer-main">
            <div className="footer-brand">
              <a className="brand" href="#home">
                <span className="brand-mark">
                  <Sparkles size={21} />
                </span>
                <span>
                  Prompt<span className="brand-accent">Forge</span>
                  <small>BYDUYUDEV</small>
                </span>
              </a>
              <p>
                Định hình AI theo cách của bạn.
                <br />
                Ý tưởng tốt bắt đầu từ prompt tốt.
              </p>
            </div>

            <div className="footer-links">
              <h4>LIÊN HỆ & CỘNG ĐỒNG</h4>
              <a href="mailto:duyudev123@gmail.com">
                <Mail size={16} /> Gmail liên hệ <ArrowUpRight size={13} />
              </a>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  showToast(
                    "Hãy thay liên kết Group Chat bằng URL cộng đồng của bạn trong src/App.jsx."
                  );
                }}
              >
                <MessageCircle size={16} /> Group Chat{" "}
                <ArrowUpRight size={13} />
              </a>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  showToast(
                    "Hãy thay liên kết Group Thông Báo bằng URL của bạn trong src/App.jsx."
                  );
                }}
              >
                <Bell size={16} /> Group Thông Báo{" "}
                <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="footer-note">
              <div className="note-icon">
                <Terminal size={19} />
              </div>
              <strong>
                YOUR PROJECT.
                <br />
                YOUR RULES.
              </strong>
              <span>Make your AI work for you.</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 ByDuyuDev. All rights reserved.</span>
            <span>
              <i /> BUILT FOR CREATORS & DEVELOPERS
            </span>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}

      {adminOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAdminOpen(false);
              setEditing(null);
            }
          }}
        >
          <section className="modal admin-modal">
            <button
              className="modal-close"
              onClick={() => {
                setAdminOpen(false);
                setEditing(null);
              }}
              aria-label="Đóng"
            >
              <X />
            </button>

            {!loggedIn ? (
              <>
                <div className="modal-icon">
                  <LockKeyhole />
                </div>
                <div className="eyebrow">RESTRICTED ACCESS</div>
                <h2>
                  Admin <span>Login</span>
                </h2>
                <p className="modal-sub">
                  Đăng nhập bằng tài khoản Supabase Auth đã được cấp quyền
                  Admin.
                </p>

                <form onSubmit={login} className="admin-form">
                  <label>
                    Email Admin
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email tài khoản Admin"
                      autoComplete="username"
                      required
                    />
                  </label>

                  <label>
                    Mật khẩu
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mật khẩu Admin"
                      autoComplete="current-password"
                      required
                    />
                  </label>

                  {adminError && (
                    <p className="form-error">{adminError}</p>
                  )}

                  <button
                    className="primary-button full-button"
                    type="submit"
                  >
                    Đăng nhập <ArrowUpRight size={16} />
                  </button>
                </form>

                <p className="security-note">
                  <ShieldCheck size={14} /> Xác thực qua Supabase Auth; quyền
                  quản trị được kiểm tra trên cơ sở dữ liệu.
                </p>
              </>
            ) : (
              <>
                <div className="admin-heading">
                  <div>
                    <div className="eyebrow">CONTROL PANEL</div>
                    <h2>
                      Quản lý <span>Prompt</span>
                    </h2>
                  </div>
                  <button className="logout-button" onClick={logout}>
                    <LogOut size={15} /> Đăng xuất
                  </button>
                </div>

                <button
                  className="primary-button full-button add-button"
                  onClick={() =>
                    setEditing({
                      id: null,
                      title: "",
                      category: "Lập trình",
                      icon: "code",
                      tag: "Prompt mới",
                      description: "",
                      prompt: "",
                      is_published: true,
                    })
                  }
                >
                  <Plus size={17} /> Thêm prompt mới
                </button>

                <button
                  className="text-button"
                  disabled={saving}
                  onClick={seedStarterPrompts}
                >
                  {saving
                    ? "Đang xử lý..."
                    : "Thêm 6 prompt mẫu vào Supabase"}
                </button>

                <div className="admin-list">
                  {prompts.map((prompt) => (
                    <div className="admin-row" key={prompt.id}>
                      <div>
                        <strong>{prompt.title}</strong>
                        <small>
                          {prompt.category} ·{" "}
                          {prompt.is_published
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </small>
                      </div>
                      <button
                        onClick={() => setEditing(prompt)}
                        aria-label={`Sửa ${prompt.title}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        aria-label={`Xóa ${prompt.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {editing && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditing(null);
          }}
        >
          <section className="modal editor-modal">
            <button
              className="modal-close"
              onClick={() => setEditing(null)}
              aria-label="Đóng"
            >
              <X />
            </button>

            {editing.viewOnly ? (
              <>
                <div className="eyebrow">
                  PROMPT PREVIEW / {editing.category}
                </div>
                <h2>{editing.title}</h2>
                <p className="modal-sub">{editing.description}</p>
                <pre className="prompt-preview">{editing.prompt}</pre>
                <button
                  className="primary-button full-button"
                  onClick={() => copyPrompt(editing)}
                >
                  <Copy size={16} /> Copy toàn bộ prompt
                </button>
              </>
            ) : loggedIn ? (
              <>
                <div className="eyebrow">ADMIN / PROMPT EDITOR</div>
                <h2>
                  {editing.id ? "Chỉnh sửa" : "Thêm"} <span>Prompt</span>
                </h2>

                <form className="admin-form" onSubmit={savePrompt}>
                  <label>
                    Tên prompt
                    <input
                      name="title"
                      defaultValue={editing.title}
                      maxLength={160}
                      required
                    />
                  </label>

                  <div className="form-row">
                    <label>
                      Danh mục
                      <select
                        name="category"
                        defaultValue={editing.category}
                      >
                        {EDITABLE_CATEGORIES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Icon
                      <select name="icon" defaultValue={editing.icon}>
                        {Object.keys(ICON_MAP).map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label>
                    Nhãn
                    <input
                      name="tag"
                      defaultValue={editing.tag}
                      maxLength={80}
                    />
                  </label>

                  <label>
                    Mô tả
                    <textarea
                      name="description"
                      defaultValue={editing.description}
                      rows="3"
                      maxLength={500}
                      required
                    />
                  </label>

                  <label>
                    Nội dung prompt
                    <textarea
                      name="prompt"
                      defaultValue={editing.prompt}
                      rows="10"
                      required
                    />
                  </label>

                  <label className="publish-option">
                    <input
                      type="checkbox"
                      name="is_published"
                      defaultChecked={editing.is_published ?? true}
                    />
                    Xuất bản công khai
                  </label>

                  <button
                    className="primary-button full-button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      "Đang lưu..."
                    ) : (
                      <>
                        <Check size={16} /> Lưu prompt
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}
