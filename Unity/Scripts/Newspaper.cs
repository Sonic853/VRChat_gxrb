
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;
using UdonLab.UrlLoader;
using UdonLab.Toolkit;
using System;

namespace Sonic853.Newspaper
{
    public class Newspaper : UdonSharpBehaviour
    {
        [SerializeField] Animator animator;
        [SerializeField] UrlsImageLoader urlsImageLoader;
        [SerializeField] UrlsStringLoader urlsStringLoader;
        [SerializeField] ImageDisplayer[] imageDisplayers;
        [SerializeField] VRCUrl sizeUrl;
        [SerializeField] VRCUrl[] vRCUrls;
        [SerializeField] Texture2D[] textures;
        [SerializeField] Texture2D defaultTexture;
        int index;
        void Start()
        {
            textures = new Texture2D[vRCUrls.Length];
            for (int i = 0; i < textures.Length; i++)
            {
                textures[i] = defaultTexture;
            }
            LoadPaper();
            size = 30;
        }
        public void LoadPaper()
        {
            urlsStringLoader.PushUrl(sizeUrl, GetComponent<UdonBehaviour>(), nameof(SetPageLoadImage), nameof(SetPage_size));
        }
        public int size;
        [NonSerialized] public string SetPage_size;
        public void SetPageLoadImage()
        {
            SetPage(SetPage_size);
            var lastPage = false;
            for (int i = 1; i < size; i++)
            {
                var i1 = i - 1;
                urlsImageLoader.PushUrl(vRCUrls[i1], GetComponent<UdonBehaviour>(), $"LoadImage{i}", nameof(LoadImage_texture));
                if (!lastPage)
                {
                    lastPage = true;
                    urlsImageLoader.PushUrl(vRCUrls[size - 1], GetComponent<UdonBehaviour>(), $"LoadImage{size}", nameof(LoadImage_texture));
                }
            }
        }
        public void SetPage() => SetPage(SetPage_size);
        public void SetPage(string _size)
        {
            int.TryParse(_size, out size);
            if (size % 2 == 1)
                size--;
        }
        [NonSerialized] public Texture2D LoadImage_texture;
        public void LoadImage1() => LoadImage(0, LoadImage_texture);
        public void LoadImage2() => LoadImage(1, LoadImage_texture);
        public void LoadImage3() => LoadImage(2, LoadImage_texture);
        public void LoadImage4() => LoadImage(3, LoadImage_texture);
        public void LoadImage5() => LoadImage(4, LoadImage_texture);
        public void LoadImage6() => LoadImage(5, LoadImage_texture);
        public void LoadImage7() => LoadImage(6, LoadImage_texture);
        public void LoadImage8() => LoadImage(7, LoadImage_texture);
        public void LoadImage9() => LoadImage(8, LoadImage_texture);
        public void LoadImage10() => LoadImage(9, LoadImage_texture);
        public void LoadImage11() => LoadImage(10, LoadImage_texture);
        public void LoadImage12() => LoadImage(11, LoadImage_texture);
        public void LoadImage13() => LoadImage(12, LoadImage_texture);
        public void LoadImage14() => LoadImage(13, LoadImage_texture);
        public void LoadImage15() => LoadImage(14, LoadImage_texture);
        public void LoadImage16() => LoadImage(15, LoadImage_texture);
        public void LoadImage17() => LoadImage(16, LoadImage_texture);
        public void LoadImage18() => LoadImage(17, LoadImage_texture);
        public void LoadImage19() => LoadImage(18, LoadImage_texture);
        public void LoadImage20() => LoadImage(19, LoadImage_texture);
        public void LoadImage21() => LoadImage(20, LoadImage_texture);
        public void LoadImage22() => LoadImage(21, LoadImage_texture);
        public void LoadImage23() => LoadImage(22, LoadImage_texture);
        public void LoadImage24() => LoadImage(23, LoadImage_texture);
        public void LoadImage25() => LoadImage(24, LoadImage_texture);
        public void LoadImage26() => LoadImage(25, LoadImage_texture);
        public void LoadImage27() => LoadImage(26, LoadImage_texture);
        public void LoadImage28() => LoadImage(27, LoadImage_texture);
        public void LoadImage29() => LoadImage(28, LoadImage_texture);
        public void LoadImage30() => LoadImage(29, LoadImage_texture);
        public void LoadImage(int index, Texture2D _texture)
        {
            if (index >= textures.Length) { return; }
            textures[index] = _texture;
            UpdateImage();
        }
        public void UpdateImage() => UpdateImage(true);
        public void UpdateImage(bool changeAnim)
        {
            imageDisplayers[0].SetTexture(textures[0]);
            imageDisplayers[imageDisplayers.Length - 1].SetTexture(textures[size - 1]);
            // var endindex = imageDisplayers.Length - 1;
            // var size2 = size - 2;
            // if (endindex > size2) endindex = size2;
            // if (index == 0)
            // {
            //     for (var startindex = 1; startindex < endindex; startindex++)
            //     {
            //         imageDisplayers[startindex].SetTexture(textures[startindex]);
            //     }
            // }
            // else
            // {
            //     var _startindex = index;
            //     if (changeAnim && animator.GetCurrentAnimatorStateInfo(0).IsName("Open2"))
            //     {
            //         animator.Play("Open1", 0);
            //     }
            //     for (var startindex = 1; startindex < endindex; startindex++)
            //     {
            //         imageDisplayers[startindex].SetTexture(textures[_startindex]);
            //         _startindex++;
            //     }
            // }
            if (changeAnim && !animator.GetCurrentAnimatorStateInfo(0).IsName("Open3") && !animator.GetCurrentAnimatorStateInfo(0).IsName("Default"))
            {
                animator.Play("Open1", 0);
            }
            var _index = index == 0 ? 1 : index;
            imageDisplayers[1].SetTexture(textures[_index]);
            imageDisplayers[2].SetTexture(textures[_index + 1]);
            imageDisplayers[3].SetTexture(textures[_index + 2]);
            imageDisplayers[4].SetTexture(textures[_index + 3]);
        }
        public void Next()
        {
            if (index + 4 > size)
            {
                if (!animator.GetCurrentAnimatorStateInfo(0).IsName("Open3"))
                {
                    // animator.Play("Open2", 0);
                    animator.SetTrigger("Open3");
                    UpdateImage(false);
                }
                return;
            }
            if (index == 0)
            {
                index = 1;
                animator.Play("Default", 0);
                animator.SetTrigger("Open1");
                UpdateImage(false);
            }
            else
            {
                index += 2;
                animator.Play("Open1", 0);
                animator.SetTrigger("Open2");
                SendCustomEventDelayedSeconds(nameof(UpdateImage), 0.251f);
            }
        }
        public void Previous()
        {
            if (animator.GetCurrentAnimatorStateInfo(0).IsName("Open3"))
            {
                animator.SetTrigger("Open1");
                return;
            }
            if (index == 0) { return; }
            if (index == 1)
            {
                index = 0;
                animator.Play("Open1", 0);
                animator.SetTrigger("Default");
            }
            else
            {
                index -= 2;
                if (animator.GetCurrentAnimatorStateInfo(0).IsName("Open3"))
                {
                    animator.SetTrigger("Open2");
                }
                else
                {
                    animator.Play("Open2", 0);
                    animator.SetTrigger("Open1");
                }
            }
            UpdateImage(false);
        }
    }
}
