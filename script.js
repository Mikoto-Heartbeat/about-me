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
});