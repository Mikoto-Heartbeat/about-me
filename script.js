/**
 * スクリプトの初期化
 * ページの読み込み完了時や各イベントに対する処理を定義
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------
    // 1. ローディング画面のフェードアウト処理
    // ------------------------------------------------
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        // 全てのリソースが読み込まれたらhideクラスを付与
        if(loader) {
            setTimeout(() => {
                loader.classList.add("hide");
            }, 300); // 演出のため少し待機
        }
    });

    // ------------------------------------------------
    // 2. AOS (Scroll Animation) の初期化
    // ------------------------------------------------
    if (typeof AOS !== 'undefined') {
        AOS.init({
            offset: 100,      // アニメーション発火位置
            duration: 800,    // アニメーション時間
            easing: 'ease-in-out-sine',
            once: true,       // 1回だけアニメーションさせる
        });
    }

    // ------------------------------------------------
    // 3. ハンバーガーメニューの開閉処理
    // ------------------------------------------------
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            // activeクラスのトグルでメニューの開閉・アイコンの変形を行う
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // アクセシビリティ(aria-expanded)の更新
            const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isExpanded);
        });
    }

    // ------------------------------------------------
    // 4. ページトップへ戻るボタンの表示・スクロール処理
    // ------------------------------------------------
    const backToTopBtn = document.getElementById("back-to-top");
    
    if(backToTopBtn) {
        window.addEventListener("scroll", () => {
            // スクロール量が300pxを超えたら表示
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            // ページトップへスムーススクロール
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ------------------------------------------------
    // 5. ページ遷移スライドアニメーション処理
    // ------------------------------------------------
    const transitionLinks = document.querySelectorAll(".transition-link");
    const transitionCover = document.getElementById("page-transition-cover");

    transitionLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // 新しいタブで開くリンクなどは除外
            if (link.target === "_blank" || e.ctrlKey || e.metaKey) return;
            
            // 現在のページへのリンク(ハッシュ等)の場合は除外
            const href = link.getAttribute("href");
            if(href.startsWith('#')) return;

            e.preventDefault(); // デフォルトの遷移を一時停止
            
            // カバーをスライドインさせる
            if(transitionCover) {
                transitionCover.classList.add("active");
            }
            
            // アニメーション完了(約600ms)後に遷移を実行
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });

    // ------------------------------------------------
    // 6. FAQアコーディオン機能
    // ------------------------------------------------
    const faqQuestions = document.querySelectorAll(".faq-question");
    
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            // activeクラスのトグル
            question.classList.toggle("active");
            
            // 答えの要素を取得
            const answer = question.nextElementSibling;
            
            // aria-expandedの更新
            const isExpanded = question.getAttribute("aria-expanded") === "true";
            question.setAttribute("aria-expanded", !isExpanded);
            
            // アニメーションのための高さ設定
            if (question.classList.contains("active")) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // ------------------------------------------------
    // 7. 小説カードの詳細表示モーダル
    // ------------------------------------------------
    const novelModal = document.getElementById("novel-modal");
    const modalTag = document.getElementById("modal-tag");
    const modalTitle = document.getElementById("modal-title");
    const modalMeta = document.getElementById("modal-meta");
    const modalContent = document.getElementById("modal-content");
    const closeNovelModal = document.querySelector(".novel-modal-close");
    const novelCards = document.querySelectorAll(".novel-card");

    const openNovelModal = (card) => {
        if (!novelModal || !modalTag || !modalTitle || !modalMeta || !modalContent) return;

        modalTag.textContent = card.dataset.tag || "作品";
        modalTitle.textContent = card.dataset.title || "作品タイトル";
        modalMeta.textContent = `作者：${card.dataset.author || "不明"}`;
        modalContent.textContent = card.dataset.content || "本文は準備中です。";
        novelModal.classList.add("open");
        novelModal.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
        if (!novelModal) return;
        novelModal.classList.remove("open");
        novelModal.setAttribute("aria-hidden", "true");
    };

    novelCards.forEach(card => {
        card.addEventListener("click", () => openNovelModal(card));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openNovelModal(card);
            }
        });
    });

    if (closeNovelModal) {
        closeNovelModal.addEventListener("click", closeModal);
    }

    if (novelModal) {
        novelModal.addEventListener("click", (event) => {
            if (event.target && event.target.dataset.close === "true") {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && novelModal && novelModal.classList.contains("open")) {
            closeModal();
        }
    });

    // ------------------------------------------------
    // 8. 小説フォームからの作品追加
    // ------------------------------------------------
    const novelForm = document.querySelector(".cupertino-form");
    const recipientEmail = "ktc26a31k0003@edu.kyoto-tech.ac.jp";

    const createMailtoLink = (titleValue, authorValue, genreValue, summaryValue, bodyValue) => {
        const subject = encodeURIComponent(`[小説展示申請] ${titleValue}`);
        const body = [
            "作品タイトル：" + titleValue,
            "作者名：" + authorValue,
            "ジャンル：" + genreValue,
            "一言紹介：" + summaryValue,
            "",
            "本文：",
            bodyValue
        ].join("\n");
        return `mailto:${recipientEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
    };

    if (novelForm) {
        novelForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const title = document.getElementById("novel-title");
            const author = document.getElementById("novel-author");
            const genre = document.getElementById("novel-genre");
            const summary = document.getElementById("novel-summary");
            const body = document.getElementById("novel-body");
            const noticeCheck = document.getElementById("novel-notice-check");
            const submissionMessage = document.getElementById("submission-message");
            const novelGrid = document.querySelector(".novel-grid");

            if (!title || !author || !genre || !summary || !body || !noticeCheck || !submissionMessage || !novelGrid) return;
            if (!title.value.trim() || !author.value.trim() || !summary.value.trim() || !body.value.trim()) {
                alert("タイトル・作者名・一言紹介・本文は必須です。");
                return;
            }
            if (!noticeCheck.checked) {
                alert("注意事項に同意してから作品を展示できます。");
                return;
            }

            submissionMessage.textContent = "投稿内容を確認しました。審査をお待ちください。";
            submissionMessage.style.display = "block";

            const genreMap = {
                ファンタジー: { className: "cover-one", tag: "幻想" },
                青春: { className: "cover-two", tag: "青春" },
                ミステリー: { className: "cover-three", tag: "ミステリー" },
                恋愛: { className: "cover-two", tag: "恋愛" },
                SF: { className: "cover-one", tag: "SF" }
            };

            const selectedGenre = genre.value;
            const coverClass = genreMap[selectedGenre]?.className || "cover-one";
            const tag = genreMap[selectedGenre]?.tag || "作品";
            const fullBody = body.value.trim();
            const content = `${summary.value.trim()}\n\n作者：${author.value.trim()}\nジャンル：${selectedGenre}\n\n本文：\n${fullBody}`;

            const mailtoLink = createMailtoLink(
                title.value.trim(),
                author.value.trim(),
                selectedGenre,
                summary.value.trim(),
                fullBody
            );

            const article = document.createElement("article");
            article.className = "novel-card";
            article.tabIndex = 0;
            article.setAttribute("role", "button");
            article.setAttribute("aria-label", `${title.value.trim()}を読む`);
            article.dataset.title = title.value.trim();
            article.dataset.tag = tag;
            article.dataset.author = author.value.trim();
            article.dataset.content = content;

            article.innerHTML = `
                <div class="novel-card-cover ${coverClass}"></div>
                <div class="novel-card-body">
                    <span class="novel-tag">${tag}</span>
                    <h4>${title.value.trim()}</h4>
                    <p>${summary.value.trim()}</p>
                </div>
            `;

            article.addEventListener("click", () => openNovelModal(article));
            article.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openNovelModal(article);
                }
            });

            // 投稿前にメール送信用の内容を生成し、メールアプリを開く
            window.location.href = mailtoLink;

            novelGrid.appendChild(article);
            novelForm.reset();
            setTimeout(() => {
                openNovelModal(article);
            }, 200);
        });
    }
});