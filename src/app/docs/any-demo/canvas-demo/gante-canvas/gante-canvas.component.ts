import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Canvas, Rect, Group, Line, FederatedWheelEvent, Text } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { GanteData, GanteOption } from './gante';
import { AntVGDraggable } from '../util/drag.canvas';
import { loadAnimation } from '@antv/g-lottie-player';
const ANIMATIONDATA ={
  "v": "5.6.10", "fr": 30, "ip": 0, "op": 60, "w": 320, "h": 320, "nm": "合成 1", "ddd": 0, "assets": [{
    "id": "image_0", "w": 320, "h": 320, "u": "", "p":
      "data:image/png;base64,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", "e": 1
  }, { "id": "image_1", "w": 320, "h": 320, "u": "", "p": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFABAMAAAA/vriZAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAGFBMVEVHcExc2/hU3PhU3PhZ2vhU3PhX2vgF9//Au8k1AAAACHRSTlMAFlczeJ3J8LgmPIcAAAKNSURBVHja7dhNTxsxEMZx7y65W6jhvLxfV4j0DCmUKwmFc0vKF+glX7+VYrVFat7WM95H1f93jJTs2J5n4iQEAAAAAAAAAAAAAAAAAAAAAPj/VOoFHsZey4ql6muOS76th6u+G9+Vqa/u+5zqtExC+j+maXUTkpojyiak3CHnbYJ/TurMNjrRTUiZYZh/RL45MVi/b04sln/Y6ibE+5CNTqe59SrwQ6f1OW4rr5yG4bVZ79THugmxXqvTuVSfdBOSPs18GDbGaz6JsgnxGYb2ubs2bZlqah+6qW5C7A+lcZgKIZxF2YRYL7t2un6YDcOpT31mObGf+rZH45MQw2HokxC7xde3wVF++1R3vn8EZA9Dv4SkA3rKbJKn4Gycl5NJ511g3jD0TcjKQc4z7qJ/geE8yiYkt8/9E5Jy0somJK+T6lmh+vo+qUhCMs5qfFOsvtDMy7wn4xv1RjchK/dRNiE9Lw33sWyBYdLKJiRdGr7oJiRdGma6CUmXhs6vY0sPw+IJ2bPxyyck5WTHjanmYSA7ttYgCVn52MomZI9hOFBCUvtvH4bjxzCkrduz3zeOQ04WFm3q6ajNW4B/Tp51E7LDpWE0C8O76GQTki4Nr7oJ2TLphk9I8rwmCZ+jSIFrdkoiIRt6rfouU9+/axFJyNrTlElIykO3/ZVhc/Kqm5DUce9/GFVvYvX9ujTEDfUqOFhsOnEFF61sQtKl4c8wHH0Lio5msglJXqJsQt7lRDIhf2+dZEJ+N1/TiSYkxXcxP3+LwgWGh4flV+X6wmS5PJUu8Eq9wNHlj0fpApv5Hn/+D1OheH0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl/QQx1TnvWVmfRwAAAABJRU5ErkJggg==", "e": 1 }, { "id": "image_2", "w": 320, "h": 320, "u": "", "p": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAMAAAD6TlWYAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAkFBMVEVHcEwKZGILbmwGnJ0KaGYLdXQThogNYl8GoaMNfn4GrrIcj5QIlZcKYl8Ijo8Hqq4IpqkwxNAy3OZT3OpG1uIt0d8t2uYVtror1+E/z9k0xc4qvMMF9PsXgYMfl5062/4nrbYFw8cG0NUI2+EH4+km4O0G8PYG6vAv4vst4/om6Pg+2P8p5vk13vwt4esA+P/mhteMAAAAL3RSTlMAZ2yFaW99Zoh1lIyBZnyRjWAM894+Gp0rzbqq9mZk4GGnt8fVSuzhrJJg8njH5cpuxs0AACAASURBVHja7JwNc6JKE4VfPsSBrIHA6AhoKopoVerW5v//u7e7Z4YZjBEwfiVr761bxs1qeDinT89A/N//HvWoRz3qUY961KMe9ahHPepRj3rU7StNZ7PZ3NRsPpul6YNLN7b5tH6heoN6fXulggdQ8vnpdD57kPyMDsgRttfX5dJxJpOJI8v3HV8+ks8tl8CTQD44NuxQdG8IbkLEfBdqJCschaF6OMKn4W+R5XgMIIFjPf3HKaaoO2CH6AAcEgvDIHiG+rNX+NxzEIQE1EWOoEiiOJ2n/zC85XKC6FxEFyA2z2OMJbJiXepr+BvPQ5YBYgQ9IsXl8l+EOCN46FiFDsgRNwksiiNZMf5nvtA0ASRwlBh9gDgmiLN/id4rKg/hSXZEriGlS0CtViv4f+tpCRIwghyBooQ4Xr7+GwyBHkrP9yU8za6p1bqqNpvddrH4aNVisd1tNlW1XhmQkiJYuoH49ssZanou2FbDs8http+oLbaAcv/Z7cZw1BBBib+dYToH50p6ID0LnkB0mg7oDGTGV3kpOOOCZfAnLwSPudZm852AsQ1RMQQv/8JMkeKT9EB6Bp5mt9ihPxFakXsSmscFPMq8vCy5l8VFnmSMA9hVVe0WmuJaaIjM0zr8fTIE8aF12/QaeKilnElCHpe08iLiXo4AOQK0mCq+ETf/XEIkhn+AIVkZZPiLvPu2nKD40LmK3qraKd2B6gCHJpeUZVKyCGc+KutBlEQly5PCfLMoc6VFeBkVK0xZGbvhr3ByOqXOh/S8ht5GHXUuiAOJCsgJdri89pexQI4oVxAlqFGdi81K6VDL0Hl9maa/Al9LfJLeYrOOM6IA+ovLFi5ZfzyzkPN0WRSZKLwsQvbwMmv1opKhkiEFyo9GqPFB59P0KjrQCkIWfQhJW8Q2OHvlu18WTOPrQmBjBEOzXDJUXk4wUVz/RyNEfGPE13h3vZMykcKJykK1OI3uWW8Z4J920XOBIWkoAizImQKkXEiGu7WUITr5ByNU6gsD9K6x7t91hKaFwxWRxa7ZazHbV58qpM0aYqkwIkXJsUjolBR8tWmsLJ38UxHOlXk1PhLflmNogHPzxrSKHYKT6Fzc+PNx52+vXFlqlxBKUtRSjBOR40tnUYXTzU4j1Cr8WUPNDKdmGx8e0wYaHspElIqeVJ7a49MbplRqPxqCdOI0m9OOAukrjGrv8I/aA0OIOXgZBsr1Xzxba4OQZuufM1qnNYzNvsGHwQG5QY0qiSLW7OtZ8Ay3yZFS2/xm2zqkbURLiAWdJCH+0ntqhCOcC1/q9Oe4F+c+z+DbVjByYOa2d0XDhl0L3PjLskFKjA3EhqFIsE0UMd9aCHEu/CE+BvfCkreNLy/BV2XOWHtPedRc5Ojgdpikoy+h6CsB2suwZMFIZjkilEb2ZJr8AB9PtXub3gfJgcdTSHwWPQNvfGIRRYuhfU0AzhhnmCeyF6KPXfTx9P7lNwpV81sRPnRUXjbik86V9CbfoWcxbC6rhAYhw56RJXQKV42P71yEKL/Gvasd9iDs6Vy0xXc2eocYWjKETphkYr2QQ4308T2LMH15G5P8cNkhKsSXcJgqIo1PX0zznXOxsykahg3C2Mshkgv4UT4qAes7FSZvL+l9hq8lPzztG5GVUZa08V2EXothc5kPEQpWQAPJNzJNjAjvL47TWnU/xCd22HigjWe02G3hcy6EjxBqKzdXShkrE5GxEmeanaAwkZ3w3mbCGc1+lvwq7hWcNkY9q/VdTH2fnGypsIwSWP7wRUuEr/eVJcq+1P0wPHYFrqnK2Kjv0uLbk2FbhQXMoSXagsIERIhru3uy8fSFZj8tv8Uaft4kj5m69B1eRXyfmyEhlLM1zgL5uhFhgDa+mzROafiT9sXTDOEBjpHNT+Jzr4mvQejaCD3oxwXfUSdEG8uRML2X9kf2VfKrOPykMnqfn5vbV66Jr43w+Zl8HDORxdQJGxvfRyPE9qfTFwauLXS/nNEFRnPjyrXpNc3Quv1GhkkpII4rtDGl8R00QuAH7a+xb8VgdC4i415qfuMblZ4Lg2cVJgV0wsq28c0JTk37W6E7MhHzSGavyY4TDl3Ow7R/r/b5Xf9EEfqWj3GsLhoby0Z40yjB+FDtD09szsqsCY+Tmh/evBA8UQV2PennwHjDW6ERYQJhEqON10QwdG9L0MSHgMXShuUcHhv5OYPc64aECY3vj50DfvR9TFX5Pe4QHzuWCJMijrMSf1orStJbjS/I749uf2teeDCx6nvNhoSHMwoISz91oUrx20dObxW2OiH8nDlXjfCWBC1+q+3HgkdwZhv7DpCfGxKNgS3OJ+Y9ldh0QiLoAT8GHXu7kmF8I4LIbxTq+NhG0FvUvsGA2YWkF4xOTVn5r52+E422cVRCJ4RGuFipVcktCBI/Ob6sMT64Jwojv36zCx5/6H9vUkH99jkDEylCZWMBfsFlCUSJJLi8NsEUx2fJD+L3bwnzlbSvTI8e+Nwz0FNuRoZuHx8bG7MkK5INzdQ3IdjmV8nux/rbF4/5PPT6v57OEkmwFNAJK4vgVV2s/SvHvyqL44Kml5729YNv9L0j/SDwe9lYNkLcrhRcruuuTtDw23ws1l6RxVb6duFzu4/0RBkGnU5u7nGnNBaZWNNAiBq8Zhab/Njg+JfDw978LoavH8KJRTAuYsZ5i+B1+NU4/yl+Cy5YXvSOD/BZ6IwvWNAMjyOc2FGSQPStFxbBq6zqpm+G38dK6OkZ4qOr/Y2eLoyPXAp5MupohJpgAjN11hCENck11sXzN73+gPzIeZKUkfkll2P83OAK+KjCo10Ch2oTxqVOksSjnYWL727NXxzf8Gvyo9u+cFTXwYcF56ozSlSSyHsXkOCf0HfGl94fnL0s/fBZ8cP8YIafMznqXnd8xXKP+liNM1qDch7EdTHusM4uPED7I9q/gvyH/OBJL/35xxVxkRod87EaZyiLvTJnqAbaHzywJEnPPcAQvxWes0z+kl/n+HJV9xpIx87axBBkBTQiILiSe9SfhplzftwKBDAMgHL/ZcNZWfTRn3tl9/Z754nVB5Msjv7S3gwQ/BTF6fk+2AICBAeYKBLbjx1tP/fgF17fvb3e3EoSMFJW7j62Ahd17n6QpLPZ2QJEBzC8GW4/99Af+Mgd37Dcr7uHncVFifcD7+QW9WTcChL8EKUzBwgsQASkfw9+7k26315+ud0ujjzOBQ7UFMV7QTKbnee3PmsdIBDAqyxKym5+N7Vv9w9h98HcK7mKYgySuiXB+fxMKxAZIDDAwLup/Zcj89/kxvbttgHOg3pdLLdmMEhwVdxakQDAU0yc7hmYGiAECCgd8kOo/Zev9fc9+6pbTeWFdRe3Gb810Lhf9kH5CQ7QBuOYY2+CIKE2aB1+Op+f8Lt2e8ypAaoAKemue6+L32n2haAPzXX0/cvqrnOijY8TpAVVVsQ6SLANtiQ4HbzLsDf94ARIDbCCk5QVzNpA+GohcMKes7y2fvj2A0fftDDoqnrnj2MN1KCLHFfFn6fBFADOh/KbtScYODjdAJOYsy5+4WB+BK8TDv0G6CkQR18ZwgSJV/BEtkGYBtuzzGw6HXhT9d4HRuIWAk6AMEFXfTZgwoHxIaH4w2CPBkZJ2BXFeLl4A/O03lawI3RaDzJxOm8psDHwBu//gxVcB7/gaUjLpwuc7nC797qY2Qq1owRpTSegDW4OmXha10OSeN76fMgZLeHkBCg4Z0lHgAzh5w/lcPqlZf9rgipIYhbznKZBuaSzkM3ruh5g4PbgIw1MEwwvvSLpaIDBkzMAwfcucI6CIfi/IGi1QV4wjMnocxLX9Xv/HJnO7cXLXBt4ByGfFayT34Cj//4mP15G6n0Onp46CMZezvEwlYnntgTf33sbeGqvXWiElgZe8DgBgMf4OUHf8flsl5i6LiP11yDOMnmyWpCJ98dpANgzR9K69Yma9as/ogSG1y0yun/3SAPs61/Ed871bk+EzmGCpg1GtLuqTWyviWfv7+/9Rpl5bU+NmCCBTmAmyuMGDvvlh/907m2GvhddnMNvbEyc8EglcTBqD4PT9/e6nwBre+WnE4QSOGPGwJOT+TkXuUTS88KBf/C9zSyTeCLL5Ti9NwyCBP/rI0GYeOYHEmSLN7GVsfmAuYMycHuJ5WL3xvTwseMe/i78oIdAJnGZgNsO5Ej9/l8PCabvtbVqwV1USpAKXjLLjyew+3/2rrU7VViJlocW8LrkGpQCvYvVWlsRLf//3908CAaSSQJV255z+umc5WqNw8zsPXtmos0HcOeL2eONfmZWnEb9mAVtMMiSd1ITExwRtdXt8WThgpujWLRsiIraUsAo0COwlf3Cm44n+FYSbghakCpbZNH0leHIYF5mfzK74BpnStEBWxX1rfkoUKFFYMfi7LdvkVipkKGKKjBli43M5OiD4UifymxPp5OpoNtLDkgQ5KVpsmDFa2A1gMzn1/l0X28Hm5+R8qxL50IGySd+aanMKBdc98jOmlOYj2aXUQoIB3BoJoB3apFYvI06WlgQs2kF9MbqEVIS91ywWhsyoMh1NpRD0xok9zgFVAewa3zu/t1aJBaOrjwuv6kU0+mkiEg9Irng8VTt9Q54Om4FB3xkDogxCdExGNABzQnQv2OH0zHrQeo0eCGDUdJSmb4LPp0qLRBvTmLFjDNgy6GfU7LFpaGAxgTo3rfDaVZ0lSfuyGCA8pXaBatKVxFjB3ySMyBxwCzQURhjAnTv3SE2WlBZkQjaKiaDKhfcVNVJUwWfTkdVBnyP4yzVUBhjApzdjjzDFpyNT4PLSz2CMmUWXJ90LoiZ9kbtgDl3QCWCmNwrvL/9NG2ky6lAHKHXRhXcBXtccK9xwXUllipPLQfEDhikySpg9wqrA/gH2s/C7YEgZroWmZZ571xQSGxVVUFkel+JNJEXIdgBk6J1QKX9fEMAh983HxgaXvdVFmxdMPVS5oK4HHH+K8LIAZKmMUQ/9WUYBsExWeRntzKrDGhA4Nn3TciYfFB1csqmaRbMUM6yYF+UeaoOFQAhvejmMsxH85lFOgec6RHY/Z74tXp4jupsnQsWQUzLkaEuWB0OG8gB94IQvaSzMLgmjHKtA+rj5FvtZ0wfShzpgDhnympMdEFBmt4fDic1hFRCnbchQjSVYT5zcvcuWMTpEcSfzv98cTrLn25B7a/OQ3V/pB3YCt6IKOORFufF6baHw2GrhJDq2OMwRIhOqZAfw0WIngI6k+znzNr5rN501jycOZMs6Ghj3Ne4YEFcMJWYzOmghJEeQyQQQjjMrvlIvSiGOaAeQSwkLsl46gs8xl7V8YUTXmStrIg/mh1hMj0Y2RxUMLI9iBHMIQQzISIjeBCE6BEkXIz8uIZbJCbdUWGIAkWO7kQZL2X1nDfvjSmslTG8PwgRvP2v00LIM2bkESzDaA/njiMwdqMu44dp9MdQ5HBWEbNJj9WzAkZOh7Mcw5jdbMQyuIWQN0QuUoQc0NW52LgEOGLKZexETag/patxwTj/5DAiFMSqGMbQIkYwK4MJhAQ5lRGwA6oyYHilBDh2UGHENIfpJOEcJtMxyl4ojNDmiBjD52EMH0Vk2bZVCIYQlMewA2oz4IgE6E4YVAhHbJBpY0HpghxGMBIzGCHViDaGe/R6c4GQNMthEq1zQPsEOHVQYcQOo/Yw8znMZCKU7CiM9Kng5nA+WEQwhhAqIzAIkSNYmwGtjRJOHlQYsUWrC2KFC7IvIiPtpchLn5s0YlRQiOHzIIZ75cklgt9yciMRFMG6U80sA9j/0qCC/ZSI7l2ULtjCCC4jlDF8PvebS5hc7xURnEUem4ZRkWhXUyU5lmaBBpft8cEyU+geqC9/kC6GiyJ4VcTw/nzu4zCO6a0ignOUtBE80gEtEfgKnWLbPzHytDyGvShDmAquBjG8PZ/PPSXrLBAbxqJpBGMuHgRAGexrHNC1GxO8SqfY0ol1OKJ0wTaGszx94zEscGmcBEVN63gWSAxn0TiCUcaFrKUNfxqHII79NLXpOSytXHWMKLPsFIU4T3gMC1waJ8FTP4I3Qh3shoxFx3G+AiNYk+VmNpZxvpr+RAvaOPy4A3cxjLKCc2mhHt6cRSKzxv9bX5Sspcu0/I9Ew6Ldxdcc8Ir2s5zM1rmggslwVdDz0g+i7NN6eC2YrFyrMYUrWW/Na3Fh0WNItI0D+te0n6UPalxQhpElL+cihHakHh5oWtW53IsBfZRIzHOTcRat1GH8rzigc1372fmgxgWXcAyvogDzEYnInM7lSQ0pAolJEjCCNV5m44DXth/ZT/mSC8ov8Rj2ikRFZDbn8pIEMakRUmBHYmKPSamqOlgTwXOzA86vbT+7Z6IhDvJLApdeUSIzTIJl2WW9UkAUngI/MIlJVkzJkssQDQl0bSYtbzHpZjNX6cI52VEo+/NOl/6QkuChLHnYHkuB0/AU2DQrL11BKVATpmYHdG/TavfNf1bjgkAMU12aiIJyEixLDhxVKVTGmAWyFPiOshRMgbCVfKN3+bcadTOv+WgCRxXDnMjExTtJgn0muC/L6pICtwIL5CkwzXMwBY45yD0SoO1f1j14VRJkm+woUSTBp7Jsy+F1969WymIpMGHfqzJXlSEaFm2UYcLF481+jL6tST0KLt3NnAe4qpAkLYwizJobEUN4Ifzc5BkCWSD8qN2FMZHfcNbDrELCeVJ2zi4JYjjlTFAohzsUOZYCJdwzDHkhY9HwSBFsBGMU3S6Av/j2swWYBIt0RZkgQZELWlQcRTCGHIc0GrssQmyzS1HHOYsJT3iU0HUzJNYlH4nIcEkrzjNSDg8mBY8cRQRC0ykJu2bnxV0/0z6TGKuQWw+bGzMsHDzSK52kVWR5iyLijMymrFnqwxiyVWAI6YYAUhYcByYSOFs83vjHlGJhliB/qk7S8tKdjCLbktUiWxGE6WA0FVNfCnI9x9gUaIqg2287mB4RHMPuAkQRhDImqjriuPS5rLfUE8tqWIekTZMXMQjCYB4zYfDtHdDsguAzdmAUwVRGUYscynoj5kI+lcXqkKxtaCpoNGwmE4ue32HdZvoZJNMyKk1gOEGsFukN+1ZlfezXdC0IEzX6LfACqB0STk2B7h0c0JhGRpy+Q5G0IPrysL1+KusTozN7RSGHEAjCoJkcA0e5LQe0fBf4KUq/2AkyQSHAsFAN1xWrSDZDMRCb24vAfhKYZUwedp+Fh8mnUKBIC8NplhFZn/U2RR5zpiymlFjMe5PQbwkZiSGhaWPk8S4/pu2Q0F5P6HjMiswnSDymxjxmXV+UVcJi2kq4yEED+ouJJGV+p41Nw3OEX5Y8o5P1kVANX3hMWdfrh6daoIFESmBqapGCHU3YkfQh6t+2irOWJOEQl1xXxWMEOeFc108Pm1pojmy4lPCewCwGfILO4kdEsDGGQftKISLwmORdlhMONSaC+7pPA1spwfMCSE0FUc6Qve+DweZ3gjsj0u9xTdUriuKjeSVEUBzXr+p6/3DsGZBrMZ8oKTgNXNqmMkPuud/Sl8HXwQ8wUxmQ8xiFHoMNeHw41YIa2O4nkZZmGkE0EDSE/sH7i/tdOqF/K/CckuE7IlgkGSOCfSZdYyZd1WIhwsWst4ze9Kk2oD8JZe+XAk3Obp/EL61NL97JTPpYYyaNDbgfqoHY2HlG1mtUDRFnceVj3yIJhpNgWEkE2b2MCJGFkYEiSA14qOVKjubLCTTQn/6h7skEHftPwAWtII5pX6nfmNvX9QFzmUslJ8ipCEFq4Ijn900YYuIDYMnuKPQY3lei0wmDUmRT41oOG/BJruRSSmPG8WiTAf37GXDqUdRMmi5f53TWvG/AJ9iAnaA/gke7iy98pmvDsD9JTpiDBlylOTVgODBgieu5i5bAB4twKVwUYCVnTQK+DYRN+QImYiFUDCesGO4PGG1hA+awASd6oHtXA+q3OefjDegFqY0B25bSc5Nl2WgD6qHvnizGpAuBr8IGzBKkNGD9gI24lg0YExD5xQbUc6b5aAMGUfrCDXjRs9ayAdlgTNMgBE73zv9GA2J/ijo9SzLgg2xAKoGN9MBr3z/xHQacQx6IEJIN+CAb0Ok8EMX/PFDwwCBuPdBRGFDKgQ3OgcG/HNinMdQDjTmQg0iapv8MOMyBahCRaAzlgUmS/TNgj8Zk2SgiHU2gMT+JSF+9EkmL3MKAYi2cjC7l/mgDFsVLVwv3DSiKCU+dAV/SCFRjfoGY8DhRTIDVmCxJlGpMCagxr3BfHbTTRBHud8hZXvAijyZwOUsQVLkinWRZ8IsF1dlUA0KCakBGE9SC6kHZE3kNVvTr92a+by3pO79F0rdvSiy74Zgg2rGeiCTpq5tKnwjBbc1pPjb/MU0lzWzKo2xAtnWd5TugqSS1NQM2o+8FgAGdiW1N9+e3NSXX7NbWgzz7lPvC1ICDxjod7SB9YTaZcMXGunO/xvqjobEe2rpmZ8BVSnq90eAWN9pYH4x28NkYMmPOZmP+otGOEJqNIUPSn3Q2xn0cjnYMh4va6awU1vR/+3DR45jhIn4Toxd301mD4SLVeFvaPCfJ+KaIgce4P2S8zRkz3tYp+slzk7I9h8F422DAkguC5L6EKw9YOr93wNIL0hwasByO+PJiGKHRsx3O/I8c8WV99ZxXcsMRX2nIvB2Oib3u5kVrIv+nDZlfeHSumuxgQ+aDNYdlu+awy5J0NI/55WsOMIuJo1jBo9s1h/6iDfseL3J3ZQFe3KZZlvoFiza+/aLaZVOJTLfthptK7aJNf9Xrke7KYSK46njM373qxQR9b8VGpFWrXr2N/44IPiOYx0xfNlz8tmVDfql+kpGdf29AA9my4aYcEMH/tNfugCOWzuR1V/cnr7v68L5wUGTwuqu8cB2z2ytRMHpZ7gcsXIeTn+EMBOEgL7pNL3nherDy301JR6AeMz0J3sEFr7jyf7kGNEs+uRoor/xjTzz3Lp3gMJyBKPIXXTrBvqs0jt86EBZYTBu6VX/jmqII9tgs777GYUTR++dde0K/XAm9t3tKqmtPepe37f/ntJcmxKlm4fXvuXjn/+Rd63qbuhLlYjuClEAMGBBpdpMYu/bn2u//dmckIRBYQsIXnPbwa++vbeKsrJm1ZiRmaCvGJXst+q2Exv91ZViohum50sgkqE1ys79m9FPAXxJBcVFriHz00/K/P+LwsaaYc+kY+BdZLfJ/MXys1RAfSzSkHT4G/9UZf8dnPyX17KdRTvCvHX/nDIzOwnQQck9D2vF31u5PZwAjr0VK5P5rAxjt0QMYSQRnbJx+rw4RBjD2RoDyC0YfRYLGT8+yHzYC1ODLLkaMAG1bMRmq70erRoCm/SG09e0EnCHVwdLT9xtCa994CG1zoBQl8Zq/JycfQtsbg8yt9DYq1UlwgGfPDxmDbDJIeuQY5Gavkr9tjjSX7UIMoZPfHcT91GnIKMrhAS11HjGI+8lkNcSYQdxBO8Q3wXz8omoQd2cUfPWzuePm+sr7HVeOgn96xCj4AQ9zXls1KdCtd4X/GBgFn3aXEXAnSMc/Kaq5f2wZwUAEl0XZ3CtSLSPorcN4clhXepPxnqBz+3UYt0TQNlqHMR+zDqOJYIRwsmm60Yp1GP2FLLypWtJBvqoYvnIhy+xbL2RpTQwOs6aZqlrI0l8J1BqZCClj+OqVQLPF4iZuZmbEv9ErgbgGF8zE0GaqciVQ2l1KFdDhJ2RIAFYPUh2a5GQ25cmecinVbNRSqnbNdVafJ9E6TrmUyvojbsytjQwwNy585RjGf3otmtCMZluu3a6J6a9F6y/ma+4nkMV0qu3MgzT76xfz1deykJs1ETy0mK+3GrLpyMRJprzh8Q1WQzqmqyHtcash2zsdRYI3PIKHVkOSzfWWJIYz5qXlKx0Gq97Ft1pO6o1cTsrrYOqizyP4fDlpfz0unx/zlcT+wHbSm6zHnX279biNhLi4aEdwD67H7S9o5jG8KV2kHKI1TMG/eEFzW8YhHEsj+HxBc3/BMF+K8VHEkVJGhv3emJaL87gV4QMERBkOm5Vo9vCK8P6Ser7a64gHLgreckm9832W1BMC1mVcwbYLv3RdtGxJPejwbt/x0qyndfIx60tfQMFxnWcbcHn2tHoyA/ItRvnv4Y8hKVAIAdnLDSXK3uptSqKLPoj5ro3hnRjDjYwcyWqqyyg4vvM8BwwXc+U/stmf37JTLfE3QbuiPom/2EK0Th0MEfz7LIIhhndCDOetjKCyQKppoLcf1UExeiZ87xEPSPE8iO5ln2FoQ30UuiWTkG4nSxrBEMM7IYaXxAoyGUniUr0bSHOX4rIDOJuBBXDVD/sfb35J72E4CiQ3TVoJQXHyySVE6GR1yzYhhndiDPNyDiiMQjxAQU/zmvWlxS78GHNvvvAWnuc584sv1GiOOiUfrx08iyJ85BIimMDVThrBAOxuVwkyUlcjb6eCHLAzCkqyoKZ15Uz5mrCsonRGtriEDBgXZDdX6PYkpNr9Psjws/LdQfgDLiPr0zFCpbono6t6H4rgXPfqz/lna/ow6IdfHPkGAkFCQCx+p1IAgYKHXJSR2YI5GUyvGf1QCLFOKeaPQ1D3y5N8cpGAZXbiHkaQkBxSnRw/4OZBSI6vduNkfDcboKDuTp43zeshMvx0Lw3MhghYJkdaBnerEGsvim1fRg4HQUbeA76puSRDUGgWlG2r1963ehCCWupL8G0JGCVZ1uxlFi5GLyGCVwoArf3hkPacDKNg6TadaXu0jhAE54/AT/upnqQWpiYgpmchISPgUnR7BxV+Vn44COwkFHyhFDxl5HgO1VkwGB3Ej8iD2m8pq/BsRkA6JCGqCTgPxDKYeJVUCaAFAOZSCmIUIXVTRl+zOc/etPhp04YtDWBOQNflh3E9E50OERD++LDvUZBlwZOPBQpeUrNNjKA+7co+cduGyTD6kBJwP0hAoOB+vzqnCT9CwgAADgRJREFUIHjBxHd5X1CKoBaf2fNium0O+pN2WcwE7Rv+iFxpW7MMKBIwB6u3HAIw3e8rKQWzMmbTtBQ6om9d3eYU2My+aH9X0o9rz/it8jJDn6dGgkUCHnbVEH7Wcq+g4DYu6zvniiD2TO5VetOEr8FNS8lfCRoFcf242NIipEfA1eEwTEBQ6f0+PacgCNKnn5QDnVWj1pUzQRgbEV2aAFsFwWGYkCqYFiEiAauOTVFRsFqKFGTlyNdpE2M35DpiX5QGpwhjo9+RIgFyD+2WMd6QNgx5MaRPwJUGQMiCVZeCbFEafEGEeUks1xGjtgHE1x1JaBtlCWmLQQhgjLIj24Z7TsBKhx9QsOpQkPQFaWv6LSmoGXxRBrGRXXYW9zPVc6PTEgV+TQ0CFhAszGfI+oAiAffaDEhJV1W5UJz8atz0FpVNSaxC0DH7Me/ywqHhLRF5oLQBHJWoJF0E1ogW2jCgDwYEBNJVVbrs9AVpQUc7qxmKGiUOxvd/mxx+Dzk2vKggd/RtDee6tJGfsZMQsQ+4AodiQEAgXZUKsK+YjpD3Ht58P4kGldgUwUuuIujgM5Mn+RmDEMClHxVvVEGohVl1DIoJAQkF01xAunpnZ8QQxGtQYnpVRtWWMbstz+L4lhAaX1QIpNfpAmahqQL7MaZdGNrIf68uICBQMBUpSK1M3ZX5REXZNKevQ5BCeBNBtkfc85BfR6wTIFXgyE9IDUIVRLQwPYes0ZFcpCBp7nvMDIISs86g0suMQJAco18PIcBnftQux691MKQL+MEDuNPIh8QmGmTNs0pz0S++/qyDeANKTG56DKZBQDAwtr2L0RcNzn4HixGXtBT4kQRYv9JAFBgsIK1BRAUBaRU6ffogzlfLno7UQVwkIfIHvYzpWwf0R7rgqksHfoPLNAb4NedIbpJ8CgG8EglYVeb4Wct8JVIw5WaQ6HsWh5o0OALBBofRGDpjkZ8N40cTYEkU+JMHsJDyluCOVyMAtFb5cikL4i1ty+iEZPQxEr00ZE6mmTf+kpGioyvgBx46xttagbsWEHS1SsfgZy1XYgy3QQx2+itKMNIIyQXHSA4FRc9E079neMREBaQu4ZLQPzYWuhPAqzQ1VxCOYOcfpEyJSU18AiWm142okKgQvOQYyXbYDazzu1mUdvCDsptbF6RM1cdh+FEBCV0cw08nC+CesTNEsIs4C2LmZTIcs41BDMHglocg5GpPfTfrefEs3s4i0HnOZbZHlVJsJsCsh1VEmDgY1oTpBPAqH48fINj9v1dyhZSlwU0SsQtbtMGv4uBV3VN7BqlpPve8+nYWfJurugzOky4B+i7ZQw8JEJ1Z6GWep8trASRtmToNbk7rLM6QTkgmPAS5sMcq4ucmZQgOkCbAXhMGCJivrOsfqIlntKsAbvBYuoUewakOQS48IhENTIn8+Is6QJoAxRoY5CDPb4Af6a0G3A2ePpKkqekGEHQmPMscGwYd/vmx/1k7QJoAOxZklS9vASDxMrUbJEWxW2IDDj49OIzVv8EOftjFCRMQ4gA7DoY4upV1myfnbtBfn95wHEWhAYIPDWP1NxfxC92kAIO7bgQk71li61YPKekYgluSb2P6PrsOQef5cfcDld+5y78sagS47wDPHPF1zysRklqKtzEQX4zi4Mpm++2zn5L7NsWvLkBQGGeUEKwJ/f46aIhvIyQgxW+nIyoKt43iWTBkxLzpo1d9dNXhH0qiEiq4j7oC6QrIuZ27WkhIRVIjuE7IC+0mCJL2szNx9KpLyU4DwXWLBFI6NTBUgFfWXR8iJA41MwTBDJSEfAaOYHD1odltnkHG2yL/orgIGf9cUifar7l154dUJKwqBjt4zKIY1RwkdbEdDLb9vEkgtAffgQf6Qf3L9beMoiQmHQQwMESAf90dPyrF9nxRI/iFscsvrw6LcX2YaU8A31AjiIUv559bxtmXiF9qTfBU7wKCoCTkrJgguNAieH8WEvYNJVuG34L7l4IcgbT4vVfWJM/rO9hB2pkhCCYoxKGIYKA7BZrd0bkMd/ltEb8QUf0g+LEOQt/A3O1ZvjIOMgRJa8YVOKghIT2Ju9fdGM0hCW2SNfyLYhxuO/gtrQkRBEMNURxCCX7MEGvyUzHWhvENDjMvo3Yn/SEfR35M9Xd6/DiCNA+Cm9kmhZuVSJASHYTkMNO7IQ0Nvl5gd/Cj+rGl+Lm0gPs5JX60JBEQ3GSY1sXGYTz+UFeDnv6AsxO+JPtFeMPwWxD+TYwfQ7DW4g/4IEnoJ3WTmvuZwCTqrsaQoqfPB5R+4J5r/DBkneSN1r8Mv/ep8WuVBKq6jKRiclzss0RoSkJy0nbBFInecbLBIICgpR+zf2FcQvLeMvzsh+BXI8jqYtIf/EKQCYUwdowQrK8YPC/GvtRPoTe80ECLDyF8y9jPwP6tfVL/Pgy/FkFEe9SnY8EuHgGCplrSRUN+HCw/IB4xwKOmH6gHwy8j7WeImS+Kn/M4/JijDhyPdlghIjY4DiPcliW69oLsyoHyWF08Wh91tm536QegJQXJ2sT+PRo/qOqgLp4xBOmHgtziRtwSsji2gxGBaTcYCUNPhLP1hSlLBe/SoZ+L4jIk8kHtH+n/Pf2qrAc+6S8yrvWFS8kRg6emn/QHIaGxmJxxjWqm5y3quSdz8pXGfxkWvUL2C5Mwi6F6o/JB7d/Ta2o99MmZIaRSAolwUyQuxkImNHQ09ymNmXdp6BeWkP0gUlj6q+1fblmPR5BLCXjqt88yRn6JBE84No5vBd+sjt6afihyiyJcv7HqjaS/4DvgR7r8VIxfEAnjNWmyhrHfZMIHQdgkP+794MMkOCTqu85o+mPysbK+wbN8pYmQeur/tXdmS20DQRTFUeGaqDAaM7IHSbYLLUhv4v//Lr3NIkwoshHZqHkIOCTA4d7bPaMNu/EhLyGq5buWKPxchILvNsKncmsNfnPQfV38Pf3H9vuqlWxpxmAbwy95gCQsysRFoesmnxSGqwifc2+paO/gZWD7Uiv/3+3jLAhhniERtpKEdO4HR6Go8DP6CdET8zp82Dwo/VqSH9l3FvE3DUK0sRfhWKdGczPxKhQZfoZ3Y3zZXV5qTL/BSvfdzCb+4usonugc3XuXhHj3VWOVPUP472S44sY7wYcXD1Y0+1H6Ufeg6fnhZm6FNvYixHaMlzXldHHdBCH2k3/AcCPe5cHF41MmrbB5UPMl+c3PvpNu7EWIA2tfGJi9aKRhhJ7hX+4oEb31veu8tG2leHTGpRun36y673k3PtJyFkQoPh5qo8vcu4kReoZ/JQ83q0CPxefwWZgFinok92Lz5fQ7zqn7nvcSTsJ1Qj6GtR0dtKtMQOhk6Blu/nhk8Svn2LtJhQGC+GDlNpHf/mbOteMkFB9jFMLSJK/AS0q/yZDM/DsUNxuBx6fzryPxwReBBbmxhI/CL5Gn8sxafpEIN+RjikJCWBeFMpnKXukwgvgrGBHdBJ6j57ybFFVqssbjo9EZt1/nLj/Xjk/8bN4JQkjCvNLWISSGASJSJIzvkGRugo7ZCbxIe3TFAmSGLgbEB70Dw48v0DnNs/m+NROij7EfRwh7WJzA+k6VasrQQUSKhNGDPCv+W0BH7AgeSS/QS7IsMRksO/Je8GnlnpB83D4/3FxKgY+P8ox3Qmhhefdy6LAlF0mhfVIhRKdExkgcHclJ0eu3t44dKW9CTyVVCllbQOfAr9ZaUp/DdxnunfpYHgxDCNMGNTE00JJhuLDSUWKI92vG+P3258WfsGbXhtST4EurXOUVRV+Pg0tQ3+W4N/Lx7jVCcvKhy8uUvFxFqcUUhSOQFJRxrZEbqY5lF4UeODdNUNza1N2BvSv4bgXf7uHm8sojxKfD6IycjDI8jPCTZuDlXGmt1BsY8e1V8YuCLpn+qwp6Lsx81tB/35N3dbhr84XiCwjdI7JEhiiRfqzzCrycW1vGNAQj1x3jBGZ3+IGQm8LTFfbcHGa+ZqRfDvVdDXOfe4jRBeOLEfK9NUmGwhC8XFDkg3rKVP1iIcxKw2ID5pUiNc1wEHqIL7rj9YXjcwhXdG4eXRnODBtiiEI0tkQKsHAoEquT5CPkUmWrBHPUGpWXLD2g1zC9cHu51RXgI4SPONSE+1OJDlucdBFiC9MNGdqkZamLpMp0mngrh3dS1FylzF1RkWnLwpqO4L0MrWiPbmjzjVYdMLg8XgM+GWpgtI5uscQMQYj88x+GsSnY0BaDsYSFHyzHLPYZk6TwR4YtNsmJXIbSq/OObAu/AZSe0AuX7R23lze4vD9a75wMA0OG2AoI0GI3Nk2uTYrBCBNdBRy1UZblpiHuyiqvx7Zj0yJ4Vt4Zvaftbn9zbQVOxjSMrzRAiGRnoChMgEo/jB2gBFHmtYG3BuTWtGM7DkN/cJ/VD21TpyI9FV9jAcl3Rd59U4b+dG+CiHYmLQLGLnD8WfVD59HBvBKfE4s7DqerFN+bDFf+zAFFFAkilK2bpm27boDqqfC9rmvbpqmtfBKxC/CE3vHa6XmG21OAGM6/0MIxwJxUJsXomF0ED5z7FegFhiTEyZFct62nqbJJ0UvTDe3oKDNI7wvRcz2FIB7D7vy3sMfHmy288JX13J3br/GHU4QdwbvWrvEhiKfjiinGBznwoXJ0ZuX3yVahO4bCR5SOpy8Mz0Pc756J4jFs3fvN+5VsT29kq99v7x+J3fNu/7XhRRRRi8gRQL538j2AQ3Kou4XdOUbk+LylesI6SdEH/PpuIfdBlPvH/WOo/X7/sHBbaqmlllpqqaWWWmqppZZaaqk51A+G2EgM/3WidwAAAABJRU5ErkJggg==", "e": 1 }],
  "layers": [{ "ddd": 0, "ind": 1, "ty": 2, "nm": "3-扫描扇形.png", "cl": "png", "refId": "image_0", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] }, { "t": 59, "s": [100] }], "ix": 10 }, "p": { "a": 0, "k": [159.938, 161, 0], "ix": 2 }, "a": { "a": 0, "k": [159.938, 161, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0, "hasMask": true, "masksProperties": [{ "inv": false, "mode": "a", "pt": { "a": 1, "k": [{ "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 0, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[184, -13], [78, 12], [42, 67.25], [160, 161.75], [274.875, 65.625]], "c": true }] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 1, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[181.187, -12.088], [77.285, 12.736], [42.027, 67.162], [160.005, 161.737], [271.003, 62.209]], "c": true }] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 6, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[167.12, -7.526], [73.712, 16.415], [42.159, 66.725], [160.028, 161.671], [250.45, 52.845]], "c": true }] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 15, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[141.8, 0.685], [67.281, 23.039], [42.398, 65.937], [160.07, 161.552], [221.243, 27.007]], "c": true }] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 25, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[113.667, 9.809], [60.134, 30.398], [42.663, 65.062], [160.117, 161.42], [180.328, 15.05]], "c": true }] }, { "i": { "x": 0.833, "y": 0.833 }, "o": { "x": 0.167, "y": 0.167 }, "t": 37, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[79.907, 20.757], [51.559, 39.229], [42.981, 64.012], [160.173, 161.262], [127.861, 12.801]], "c": true }] }, { "t": 59, "s": [{ "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], "v": [[18.013, 40.829], [35.837, 55.419], [43.565, 62.087], [160.275, 160.972], [44.921, 63.334]], "c": true }] }], "ix": 1 }, "o": { "a": 0, "k": 100, "ix": 3 }, "x": { "a": 0, "k": 0, "ix": 4 }, "nm": "蒙版 1" }], "ip": 0, "op": 60, "st": 0, "bm": 0 }, { "ddd": 0, "ind": 2, "ty": 2, "nm": "2-扫描角度.png", "cl": "png", "refId": "image_1", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [160, 160, 0], "ix": 2 }, "a": { "a": 0, "k": [160, 160, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0, "ip": 0, "op": 60, "st": 0, "bm": 0 }, { "ddd": 0, "ind": 3, "ty": 2, "nm": "1-旋转外圈.png", "cl": "png", "refId": "image_2", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [1080] }, { "t": 59, "s": [540] }], "ix": 10 }, "p": { "a": 0, "k": [160, 160, 0], "ix": 2 }, "a": { "a": 0, "k": [160, 160, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0, "ip": 0, "op": 60, "st": 0, "bm": 0 }], "markers": []
};
@Component({
  selector: 'gante-canvas',
  templateUrl: './gante-canvas.component.html',
  styleUrls: ['./gante-canvas.component.less']
})
export class GanteCanvasComponent {
  constructor() {
    this.initStage();
  }
  private canvas!: Canvas;
  private stageGroup!: Group;
  private barGroup: Group;
  @ViewChild('gante', { static: true }) set ganteRef(value: ElementRef<HTMLDivElement>) {
    this.ganteEl = value.nativeElement;
  }
  @Input() ganteOption: GanteOption = new GanteOption(); 
  ganteEl: HTMLDivElement;
  get getGanteRect() {
    return this.ganteEl.getBoundingClientRect();
  }
  ngAfterViewInit() {
    const { width, height } = this.getGanteRect;
    this.canvas = new Canvas({
      container: this.ganteEl, // 画布 DOM 容器 id
      width,
      height,
      renderer: new Renderer() // 指定渲染器
    });
    this.stageGroup = new Group({
      name: 'gante graph',
      style: {
        y: 40
      }
    });
    this.canvas.addEventListener('wheel', ($event: FederatedWheelEvent) => {
      this.onMouseWheeel($event);
    });
    this.canvas.appendChild(this.stageGroup);
    requestAnimationFrame(() => {
      this.createStage();
      let anime = loadAnimation(ANIMATIONDATA as any, {
        loop: true,
        autoplay: true,
      }).render(this.canvas);
    });
  }
  initStage() {
  }
  // stage
  createStage() {
    this.stageGroup.removeChildren();
    this.createBackground();
    this.ganteBtn();
  }
  createBackground() {
    const { barWidth, scale, scrollOffsetX, colData, barHeight, lineRowTotal, rowHeight } = this.ganteOption;
    let actualLength = barWidth * scale;
    let headGroup = new Group({
      style: {
        cursor: 'grab'
      }
    });
    for (let i = 0; i < colData.length; i++) {
      let line = new Line({
        style: {
          x1: i * actualLength - scrollOffsetX,
          y1: 0,
          x2: i * actualLength + 1 - scrollOffsetX,
          y2: lineRowTotal * rowHeight,
          lineWidth: 1,
          stroke: '#333',
          lineDash: [5, 5]
        }
      });
      let rect = new Rect({
        style: {
          x: i * actualLength - scrollOffsetX + 1,
          y: 0,
          width: actualLength - scrollOffsetX,
          height: barHeight,
          fill: '#309eff'
        }
      });
      let text = new Text({
        style: {
          x: actualLength / 2,
          y: barHeight / 2,
          text: colData[i],
          fontSize: 14,
          fill: '#fff',
          textBaseline: 'middle',
          textAlign: 'center'
        }
      });
      rect.appendChild(text);
      rect.addEventListener('mousemove', $event => {
        rect.style.fill = '#e06568';
      });
      AntVGDraggable({canvas: this.canvas ,el: rect, parent: headGroup})
      headGroup.appendChild(line);
      headGroup.appendChild(rect);
      this.stageGroup.appendChild(headGroup);
    }
  }
  ganteBtn() {
    let btnRect = new Rect({
      style: {
        x: 0,
        y: 0,
        width: 80,
        height: 36,
        radius: 5,
        fill: "#61afee"
      }
    })
    let text = new Text({
      style: {
        x: 40,
        y: 18,
        text: '重置',
        fontSize: 12,
        fill: '#000',
        textBaseline: 'middle',
        textAlign: 'center'
      }
    })
    btnRect.appendChild(text);
    btnRect.addEventListener('click', () => {
      this.createStage();
    })
    this.canvas.appendChild(btnRect);
  }
  onMouseWheeel($event: FederatedWheelEvent) {
    const { shiftKey, deltaY } = $event;
    const dir = deltaY > 0 ? -1 : 1;
    let { scrollOffsetX, scale } = this.ganteOption;
    if (shiftKey) {
      let diffScroll = 50;
      // 水平滚动
      scrollOffsetX += diffScroll * dir * -1;
      if (scrollOffsetX < 0) {
        this.ganteOption.scrollOffsetX = scrollOffsetX;
        this.stageGroup.translate(diffScroll * dir * -1);
      } else {
        this.ganteOption.scrollOffsetX = 0;
      }
    } else {
      // 缩放
      scale += dir * 0.2;
      if (scale <= 4 && scale >= 1) {
        this.ganteOption.scale = scale;
      }
    }
    this.renderGante();
  }
  renderGante() {
    this.stageGroup.removeChildren();
    this.createStage();
  }
}
