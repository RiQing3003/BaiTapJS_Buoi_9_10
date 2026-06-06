///Đối tượng nhân viên với các thuộc tính và phương thức cần thiết để quản lý thông tin nhân viên, tính tổng lương và xếp loại nhân viên dựa trên số giờ làm việc.
class NhanVien {
  constructor(_taiKhoan, _hoTen, _email, _matKhau, _ngayLam, _luongCB, _chucVu, _gioLam) {
    this.taiKhoan = _taiKhoan;
    this.hoTen = _hoTen;
    this.email = _email;
    this.matKhau = _matKhau;
    this.ngayLam = _ngayLam;
    this.luongCB = Number(_luongCB);
    this.chucVu = _chucVu;
    this.gioLam = Number(_gioLam);
    this.tongLuong = this.tinhTongLuong();
    this.loaiNV = this.xepLoai();
  }
// Phương thức tính tổng lương dựa trên chức vụ của nhân viên
  tinhTongLuong() {
    if (this.chucVu === "Giám đốc") return this.luongCB * 3;
    if (this.chucVu === "Trưởng phòng") return this.luongCB * 2;
    return this.luongCB;
  }
// Phương thức xếp loại nhân viên dựa trên số giờ làm việc trong tháng
  xepLoai() {
    if (this.gioLam >= 192) return "Xuất sắc";
    if (this.gioLam >= 176) return "Giỏi";
    if (this.gioLam >= 160) return "Khá";
    return "Trung bình";
  }
}
// Biến toàn cục để lưu trữ danh sách nhân viên và khóa lưu trữ trong localStorage
const STORAGE_KEY = "danhSachNhanVien";
let danhSachNV = [];
// Các phần tử DOM để lấy giá trị từ form và hiển thị thông báo lỗi
const fields = {
  taiKhoan: document.getElementById("tknv"),
  hoTen: document.getElementById("name"),
  email: document.getElementById("email"),
  matKhau: document.getElementById("password"),
  ngayLam: document.getElementById("datepicker"),
  luongCB: document.getElementById("luongCB"),
  chucVu: document.getElementById("chucvu"),
  gioLam: document.getElementById("gioLam"),
};
// Các phần tử DOM để hiển thị thông báo lỗi cho từng trường dữ liệu
const messages = {
  taiKhoan: document.getElementById("tbTKNV"),
  hoTen: document.getElementById("tbTen"),
  email: document.getElementById("tbEmail"),
  matKhau: document.getElementById("tbMatKhau"),
  ngayLam: document.getElementById("tbNgay"),
  luongCB: document.getElementById("tbLuongCB"),
  chucVu: document.getElementById("tbChucVu"),
  gioLam: document.getElementById("tbGiolam"),
};
// Hàm khởi tạo các tùy chọn chức vụ trong form
function khoiTaoChucVu() {
  fields.chucVu.innerHTML = `
    <option>Chọn chức vụ</option>
    <option>Giám đốc</option>
    <option>Trưởng phòng</option>
    <option>Nhân viên</option>
  `;
}
// Hàm lấy giá trị từ form và trả về một đối tượng chứa thông tin nhân viên
function layGiaTriForm() {
  return {
    taiKhoan: fields.taiKhoan.value.trim(),
    hoTen: fields.hoTen.value.trim(),
    email: fields.email.value.trim(),
    matKhau: fields.matKhau.value,
    ngayLam: fields.ngayLam.value.trim(),
    luongCB: fields.luongCB.value.trim(),
    chucVu: fields.chucVu.value,
    gioLam: fields.gioLam.value.trim(),
  };
}
// Hàm hiển thị thông báo lỗi cho từng trường dữ liệu
function hienThongBao(key, noiDung) {
  messages[key].innerText = noiDung;
  messages[key].style.display = noiDung ? "block" : "none";
}
// Hàm xóa tất cả thông báo lỗi
function xoaThongBao() {
  Object.keys(messages).forEach((key) => hienThongBao(key, ""));
}
// Hàm kiểm tra tính hợp lệ của dữ liệu trong form, bao gồm các quy tắc về định dạng và giá trị của từng trường dữ liệu
function kiemTraForm(nv, isUpdate = false) {
  let hopLe = true;
  const ngayLamRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const matKhauRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,10}$/;
  const tenRegex = /^[A-Za-zÀ-ỹ\s]+$/;

  xoaThongBao();
// Kiểm tra tính hợp lệ của từng trường dữ liệu và hiển thị thông báo lỗi nếu có
  if (!/^\d{4,6}$/.test(nv.taiKhoan)) {
    hienThongBao("taiKhoan", "Tài khoản phải là 4 - 6 ký số và không để trống.");
    hopLe = false;
  } else if (!isUpdate && danhSachNV.some((item) => item.taiKhoan === nv.taiKhoan)) {
    hienThongBao("taiKhoan", "Tài khoản đã tồn tại.");
    hopLe = false;
  }

  if (!nv.hoTen || !tenRegex.test(nv.hoTen)) {
    hienThongBao("hoTen", "Tên nhân viên phải là chữ và không để trống.");
    hopLe = false;
  }

  if (!emailRegex.test(nv.email)) {
    hienThongBao("email", "Email không đúng định dạng và không để trống.");
    hopLe = false;
  }

  if (!matKhauRegex.test(nv.matKhau)) {
    hienThongBao("matKhau", "Mật khẩu 6 - 10 ký tự, có số, chữ hoa và ký tự đặc biệt.");
    hopLe = false;
  }

  if (!ngayLamRegex.test(nv.ngayLam)) {
    hienThongBao("ngayLam", "Ngày làm phải đúng định dạng mm/dd/yyyy.");
    hopLe = false;
  }
// Kiểm tra tính hợp lệ của lương cơ bản, chức vụ và số giờ làm việc trong tháng
  const luongCB = Number(nv.luongCB);
  if (!nv.luongCB || Number.isNaN(luongCB) || luongCB < 1000000 || luongCB > 20000000) {
    hienThongBao("luongCB", "Lương cơ bản phải từ 1,000,000 đến 20,000,000.");
    hopLe = false;
  }

  if (!["Giám đốc", "Trưởng phòng", "Nhân viên"].includes(nv.chucVu)) {
    hienThongBao("chucVu", "Vui lòng chọn chức vụ hợp lệ.");
    hopLe = false;
  }

  const gioLam = Number(nv.gioLam);
  if (!nv.gioLam || Number.isNaN(gioLam) || gioLam < 80 || gioLam > 200) {
    hienThongBao("gioLam", "Số giờ làm trong tháng phải từ 80 đến 200.");
    hopLe = false;
  }

  return hopLe;
}
// Hàm gán giá trị của một đối tượng nhân viên vào form để hiển thị thông tin khi sửa nhân viên
function ganGiaTriForm(nv) {
  fields.taiKhoan.value = nv.taiKhoan;
  fields.hoTen.value = nv.hoTen;
  fields.email.value = nv.email;
  fields.matKhau.value = nv.matKhau;
  fields.ngayLam.value = nv.ngayLam;
  fields.luongCB.value = nv.luongCB;
  fields.chucVu.value = nv.chucVu;
  fields.gioLam.value = nv.gioLam;
}
// Hàm reset form về trạng thái ban đầu khi thêm mới nhân viên hoặc đóng modal
function resetForm() {
  document.querySelector("#myModal form").reset();
  if (typeof $ !== "undefined" && $("#datepicker").datepicker) {
    $("#datepicker").datepicker("setDate", new Date());
  }
  fields.taiKhoan.disabled = false;
  xoaThongBao();
}
// Hàm lưu trữ danh sách nhân viên vào localStorage
function luuLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachNV));
}
// Hàm lấy dữ liệu danh sách nhân viên từ localStorage và khởi tạo lại đối tượng NhanVien để đảm bảo các phương thức tính toán vẫn hoạt động
function layLocalStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  danhSachNV = data.map(
    (nv) => new NhanVien(nv.taiKhoan, nv.hoTen, nv.email, nv.matKhau, nv.ngayLam, nv.luongCB, nv.chucVu, nv.gioLam)
  );
}
// Hàm tạo một dòng HTML cho mỗi nhân viên trong bảng hiển thị danh sách nhân viên
function taoDongNhanVien(nv) {
  return `
    <tr>
      <td>${nv.taiKhoan}</td>
      <td>${nv.hoTen}</td>
      <td>${nv.email}</td>
      <td>${nv.ngayLam}</td>
      <td>${nv.chucVu}</td>
      <td>${nv.tongLuong.toLocaleString("vi-VN")}</td>
      <td>${nv.loaiNV}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="xoaNV('${nv.taiKhoan}')">Xóa</button>
        <button class="btn btn-warning btn-sm" onclick="suaNV('${nv.taiKhoan}')">Sửa</button>
      </td>
    </tr>
  `;
}
// Hàm hiển thị bảng danh sách nhân viên, có thể nhận một danh sách nhân viên tùy chọn để hiển thị kết quả tìm kiếm hoặc toàn bộ danh sách nếu không có tham số nào được truyền vào
function renderTable(ds = danhSachNV) {
  document.getElementById("tableDanhSach").innerHTML = ds.map(taoDongNhanVien).join("");
}
// Hàm thêm mới một nhân viên vào danh sách, kiểm tra tính hợp lệ của dữ liệu trước khi thêm và cập nhật lại bảng hiển thị sau khi thêm thành công
function themNhanVien() {
  const data = layGiaTriForm();
  if (!kiemTraForm(data)) return;

  const nv = new NhanVien(
    data.taiKhoan,
    data.hoTen,
    data.email,
    data.matKhau,
    data.ngayLam,
    data.luongCB,
    data.chucVu,
    data.gioLam
  );

  danhSachNV.push(nv);
  luuLocalStorage();
  renderTable();
  $("#myModal").modal("hide");
}
// Hàm xóa một nhân viên khỏi danh sách dựa trên tài khoản, cập nhật lại bảng hiển thị và lưu trữ sau khi xóa thành công
function xoaNV(taiKhoan) {
  danhSachNV = danhSachNV.filter((nv) => nv.taiKhoan !== taiKhoan);
  luuLocalStorage();
  timNhanVien();
}
// Hàm sửa thông tin một nhân viên, hiển thị thông tin hiện tại của nhân viên lên form để người dùng có thể chỉnh sửa, sau đó cập nhật lại bảng hiển thị và lưu trữ sau khi cập nhật thành công
function suaNV(taiKhoan) {
  const nv = danhSachNV.find((item) => item.taiKhoan === taiKhoan);
  if (!nv) return;

  ganGiaTriForm(nv);
  fields.taiKhoan.disabled = true;
  document.getElementById("btnThemNV").style.display = "none";
  document.getElementById("btnCapNhat").style.display = "inline-block";
  document.getElementById("header-title").innerText = "Cập nhật nhân viên";
  xoaThongBao();
  $("#myModal").modal("show");
}
// Hàm cập nhật thông tin một nhân viên sau khi chỉnh sửa, kiểm tra tính hợp lệ của dữ liệu trước khi cập nhật và cập nhật lại bảng hiển thị sau khi cập nhật thành công
function capNhatNhanVien() {
  const data = layGiaTriForm();
  if (!kiemTraForm(data, true)) return;

  const index = danhSachNV.findIndex((nv) => nv.taiKhoan === data.taiKhoan);
  if (index === -1) return;

  danhSachNV[index] = new NhanVien(
    data.taiKhoan,
    data.hoTen,
    data.email,
    data.matKhau,
    data.ngayLam,
    data.luongCB,
    data.chucVu,
    data.gioLam
  );

  luuLocalStorage();
  renderTable();
  $("#myModal").modal("hide");
}
// Hàm tìm kiếm nhân viên dựa trên loại nhân viên, lọc danh sách nhân viên theo từ khóa nhập vào và hiển thị kết quả tìm kiếm trên bảng hiển thị danh sách nhân viên
function timNhanVien() {
  const keyword = document.getElementById("searchName").value.trim().toLowerCase();
  const ketQua = danhSachNV.filter((nv) => nv.loaiNV.toLowerCase().includes(keyword));
  renderTable(ketQua);
}

document.getElementById("btnThem").addEventListener("click", function () {
  resetForm();
  document.getElementById("btnThemNV").style.display = "inline-block";
  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("header-title").innerText = "Thêm nhân viên";
});

document.getElementById("btnThemNV").addEventListener("click", themNhanVien);
document.getElementById("btnCapNhat").addEventListener("click", capNhatNhanVien);
document.getElementById("btnTimNV").addEventListener("click", timNhanVien);
document.getElementById("searchName").addEventListener("input", timNhanVien);

khoiTaoChucVu();
layLocalStorage();
renderTable();
document.getElementById("btnCapNhat").style.display = "none";
